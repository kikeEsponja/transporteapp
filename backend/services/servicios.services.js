//*REQUIRE**********************************************************************************************************************
const serviciosModel = require('../models/servicios.model');
const usuariosModel = require('../models/usuarios.model');
const estados = require('../constants/estados');
const estados_solicitud = require('../constants/estados_solicitud');
const crearError = require('../utils/httpErrors');

//*01**************************************************************************************************************************
const obtenerServicios = async () => {
    return await serviciosModel.obtenerServicios();
};

const obtenerSolicitudes = async () => {
    return await serviciosModel.obtenerSolicitudes();
};

//*02**************************************************************************************************************************
const validarTransicionEstado = (estadoActual, nuevoEstado) => { 
    const transicionesValidas = {
        [estados.PUBLICADO]: [estados.ASIGNADO, estados.CANCELADO],
        [estados.ASIGNADO]: [estados.RECOGIDO, estados.CANCELADO],
        [estados.RECOGIDO]: [estados.ENTREGADO, estados.CANCELADO],
        [estados.ENTREGADO]: []
    };

    return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
};

//*03**************************************************************************************************************************
const validarMomentoEvidencias = (servicio, momento) => {
    if(momento === 'recogida' && servicio.estado_id !== estados.ASIGNADO){
        throw crearError('Las evidencias de recogida sólo pueden subirse cuando el servicio está ASIGNADO', 400);
    }

    if(momento === 'entrega' && servicio.estado_id !== estados.RECOGIDO){
        throw crearError('Las evidencias de entrega sólo pueden subirse cuando el servicio está RECOGIDO', 400);
    }

    if(momento !== 'recogida' && momento !== 'entrega'){
        throw crearError('El momento de las evidencias debe ser Recogida o Entrega', 400);
    }
};

//*04*************************************************************************************************************************

const crearServicio = async (servicio) => {
    return await serviciosModel.crearServicio(servicio);
};

//*05**************************************************************************************************************************
const reservarServicio = async (idServicio, idConductor) => {
    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio){
        throw crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }

    const conductor = await usuariosModel.obtenerUsuarioPorId(idConductor);

    if(!conductor){
        throw crearError(`El conductor con ID ${idConductor} no existe`, 404);
    }

    const transicionValida = validarTransicionEstado(servicio.estado_id, estados.ASIGNADO);

    if(!transicionValida){
        throw crearError(`No se puede reservar el servicio ${idServicio} desde su estado actual`, 400);
    }

    return await serviciosModel.reservarServicio(idServicio, idConductor);
};

//*06**************************************************************************************************************************
const recogerServicio = async (idServicio, combustibleRecogida, idConductor) => {
    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio){
        throw new crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }

    if(servicio.conductor_id !== idConductor){
        throw crearError('No tienes permiso para operar este servicio', 403);
    }

    const transicionValida = validarTransicionEstado(servicio.estado_id, estados.RECOGIDO);

    if(!transicionValida){
        throw crearError(`No se puede recoger el servicio ${idServicio} desde su estado actual`, 400);
    }

    await validarEvidencias(idServicio, 'recogida');

    return await serviciosModel.recogerServicio(idServicio, combustibleRecogida);
};

//*07**************************************************************************************************************************
const entregarServicio = async (idServicio, combustibleEntrega, idConductor) => {
    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio){
        throw crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }

    if(servicio.conductor_id !== idConductor){
        throw crearError('No tienes permiso para operar este servicio', 403);
    }

    const transicionValida = validarTransicionEstado(servicio.estado_id, estados.ENTREGADO);

    if(!transicionValida){
        throw crearError(`No se puede entregar el servicio ${idServicio} desde su estado actual`, 400);
    }

    await validarEvidencias(idServicio, 'entrega');
    
    return await serviciosModel.entregarServicio(idServicio, combustibleEntrega);
};

//*08**************************************************************************************************************************
const obtenerServicioPorId = async (id) => {
    return await serviciosModel.obtenerServicioPorId(id);
};

//*09**************************************************************************************************************************
const subirFotos = async (archivosRecibidos, momento, idServicio, idConductor) => {

    const servicio = await obtenerServicioPorId(idServicio);
    
    if(!servicio){
        throw crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }

    if(servicio.conductor_id !== idConductor){
        throw crearError('No tienes permiso para subir evidencias de este servicio', 403);
    }

    validarMomentoEvidencias(servicio, momento);

    if (!archivosRecibidos || Object.keys(archivosRecibidos).length === 0) {
        throw crearError('No se han subido archivos de imagen.', 400);
    }

    for (const [tipoCampo, fotosTipo] of Object.entries(archivosRecibidos)) {
        
        for (const archivo of fotosTipo) {
            const foto = {
                
                momento,
                tipo: tipoCampo,
                ruta: `/uploads/fotos/${archivo.filename}`,
                servicio_id: idServicio,
                
            };
            await serviciosModel.subirFoto(foto);
        }
    }
    console.log('listo se han subido las fotos');
    return;
};

//*10**************************************************************************************************************************
const subirVideo = async (archivosRecibidos, momento, idServicio, idConductor) => {

    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio){
        throw crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }
    
    if(servicio.conductor_id !== idConductor){
        throw crearError('No tienes permiso para subir evidencias de este servicio', 403);
    }

    validarMomentoEvidencias(servicio, momento);

    if (!archivosRecibidos || Object.keys(archivosRecibidos).length === 0) {
        throw crearError('No se han subido archivos de video.', 400);
    }

    const campos = Object.keys(archivosRecibidos);
    const primerCampo = campos[0];
    
    const archivo = archivosRecibidos[primerCampo]?.[0];

    if(!archivo){
        throw crearError('El archivo no es válido o está corrupto', 400)
    }
    const video = {
        momento,
        ruta: `/uploads/videos/${archivo.filename}`,
        servicio_id: idServicio,
                
    };
    await serviciosModel.subirVideo(video);

    //console.log('Listo, se ha subido el video');
    return;
};

//*11**************************************************************************************************************************
const solicitarCancelacion = async (datosSolicitud, conductorId) => {
    const { servicio_id, motivo } = datosSolicitud;

    //console.log('=== SOLICITUD DE CANCELACIÓN ===');
    //console.log('servicio_id recibido:', servicio_id);
    //console.log('conductorId:', conductorId);
    //console.log('motivo:', motivo);

    if(!servicio_id || !motivo){
        throw crearError(`El ID del servicio y el motivo son obligatorios`, 400);
    }

    const servicio = await obtenerServicioPorId(servicio_id);
    if(!servicio){
        throw crearError(`El servicio con ID ${servicio_id} no existe`, 404);
    }

    if(servicio.conductor_id !== conductorId){
        throw crearError('No tienes permiso para solicitar la cancelación de este servicio', 403);
    }

    // ESTAS LÍNEAS PUEDEN SER ELIMINADAS (A menos que falle todo)
    const transicionValida = validarTransicionEstado(servicio.estado_id, estados.CANCELADO);

    if(!transicionValida){
        throw crearError('No se puede solicitar la cancelación desde el estado actual del servicio', 400);
    }
    //**************************************************************************** */
    
    if(servicio.estado_id !== estados.ASIGNADO && servicio.estado_id !== estados.RECOGIDO){
        throw crearError(
            'Solo puedes solicitar la cancelación de un servicio asignado o recogido', 400
        );
    }

    const solicitudPendiente = await serviciosModel.obtenerSolicitudPendientePorServicio(servicio_id);

    //console.log('Buscando solicitud pendiente para servicio:', servicio_id);
    //console.log('Resultado solicitud pendiente:', solicitudPendiente);
    
    if(solicitudPendiente){
        throw crearError('Ya existe una solicitud de cancelación pendiente para este servicio', 409);
    }

    const solicitud = {
        servicio_id,
        conductor_id: conductorId,
        motivo
    }

    return await serviciosModel.solicitarCancelacion(solicitud);
};

//*12**************************************************************************************************************************
const cancelarServicio = async (idServicio) => {
    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio) {
        throw crearError(`El servicio con id ${idServicio} no existe`, 404);
    }

    const transicionValida = validarTransicionEstado(servicio.estado_id, estados.CANCELADO);

    if(!transicionValida){
        throw crearError(`No se puede cancelar el servicio ${idServicio} desde su estado actual`, 400);
    }
    return await serviciosModel.cancelarServicio(idServicio);
}

//*13**************************************************************************************************************************
const rechazarSolicitudCancelacion = async (idSolicitud) => {
    const solicitud = await serviciosModel.obtenerSolicitudCancelacionPorId(idSolicitud);

    if(!solicitud){
        throw crearError(`La solicitud con ID ${idSolicitud} no existe`, 404);
    }

    if(solicitud.estado_id !== estados_solicitud.PENDIENTE){
        throw crearError('La solicitud ya ha sido procesada', 400);
    }

    return await serviciosModel.rechazarSolicitudCancelacion(idSolicitud);
}

//*14**************************************************************************************************************************
const aprobarSolicitudCancelacion = async (idSolicitud) => {
    const solicitud = await serviciosModel.obtenerSolicitudCancelacionPorId(idSolicitud);

    if(!solicitud){
        throw crearError(`La solicitud con ID ${idSolicitud} no existe`, 404);
    }

    if(solicitud.estado_id !== estados_solicitud.PENDIENTE){
        throw crearError('La solicitud ya ha sido procesada', 400);
    }

    return await serviciosModel.aprobarSolicitudCancelacion(idSolicitud);
}

//*15**************************************************************************************************************************
const obtenerEvidenciasServicio = async (idServicio, momento) => {
    const servicio = await obtenerServicioPorId(idServicio);

    if(!servicio){
        throw new Error(`El servicio con ID ${idServicio} no existe`);
    }

    return await serviciosModel.obtenerEvidenciasServicio(
        idServicio,
        momento
    );
};

//*16**************************************************************************************************************************
const validarEvidencias = async (idServicio, momento) => {
    const evidencias = await obtenerEvidenciasServicio(idServicio, momento);
    const fotosObligatorias = ['frontal', 'trasera', 'lateral_izquierdo', 'lateral_derecho', 'tablero_autonomia', 'tablero_kilometraje', 'contrato'];
    const fotosFaltantes = fotosObligatorias.filter(
        tipo => !evidencias.fotos.includes(tipo)
    );

    const videoFaltante = !evidencias.video;

    if(fotosFaltantes.length > 0 || videoFaltante){
        const faltantes = [
            ...fotosFaltantes,
            ...(videoFaltante ? ['video'] : [])
        ];

        throw new Error(`Faltan evidencias obligatorias: ${faltantes.join(', ')}`);

    }

    return {
        completo: true
    };
};

//*17**************************************************************************************************************************
module.exports = {
    obtenerServicios,
    crearServicio,
    reservarServicio,
    recogerServicio,
    obtenerServicioPorId,
    entregarServicio,
    cancelarServicio,
    obtenerSolicitudes,
    solicitarCancelacion,
    rechazarSolicitudCancelacion,
    aprobarSolicitudCancelacion,
    subirFotos,
    subirVideo,
    obtenerEvidenciasServicio,
    validarEvidencias
}