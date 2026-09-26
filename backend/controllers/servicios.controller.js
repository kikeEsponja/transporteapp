//*REQUIRE**********************************************************************************************************************
const estados_solicitud = require('../constants/estados_solicitud');
const serviciosService = require('../services/servicios.services');
const crearError = require('../utils/httpErrors');

//*01***************************************************************************************************************************
const obtenerServicios = async (req, res, next) => {
    try{
        const servicios = await serviciosService.obtenerServicios();

        res.json(servicios);
        
    }catch(error){
        next(error);
    }
};

const obtenerSolicitudes = async (req, res, next) => {
    try{
        const solicitudes = await serviciosService.obtenerSolicitudes();

        res.json(solicitudes);
        
    }catch(error){
        next(error);
    }
};

//*02****************************************************************************************************************************
const crearServicio = async (req, res, next) => {
    try{
        const resultado = await serviciosService.crearServicio(req.body);

        res.status(201).json({
            message: 'Servicio creado correctamente',
            id: resultado.id
        });
        
    }catch(error){
        next(error);
    }
};

//*03****************************************************************************************************************************
const reservarServicio = async (req, res, next) => {
    try{
        const idServicio = req.params.id;
        const idConductor = req.usuario.id;

        const resultado = await serviciosService.reservarServicio(idServicio, idConductor);

        if(resultado.cambios === 0){
            return res.status(404).json({
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            message: 'Servicio reservado correctamente',
        });
        
    }catch(error){
        next(error);
    }
}

//*04*****************************************************************************************************************************
const recogerServicio = async (req, res, next) => {
    try{
        const idServicio = req.params.id;
        const combustibleRecogida = req.body.combustible_recogida;

        const resultado = await serviciosService.recogerServicio(idServicio, combustibleRecogida, req.usuario.id);

        if(resultado.cambios === 0){
            return res.status(404).json({
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            message: 'Servicio recogido correctamente',
            servicio: idServicio
        });
        
    }catch(error){
        next(error);
    }
};

//*05*****************************************************************************************************************************
const entregarServicio = async (req, res, next) => {
    try{
        const idServicio = req.params.id;
        const combustibleEntrega = req.body.combustible_entrega;

        const resultado = await serviciosService.entregarServicio(idServicio, combustibleEntrega, req.usuario.id);

        if(resultado.cambios === 0){
            return res.status(404).json({
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            message: 'Servicio entregado correctamente',
            servicio: idServicio
        });
        
    }catch(error){
        next(error);
    }
};

//*06*****************************************************************************************************************************
const subirFotos = async (req, res, next) => {
    try{
        const resultado = await serviciosService.subirFotos(req.files, req.body.momento, req.params.id, req.usuario.id);

        res.status(201).json({
            message: 'Fotos subidas correctamente',
            //id: resultado.id
            resultado
        });
        
    }catch(error){
        next(error);
    }
};

//*07*****************************************************************************************************************************
const subirVideo = async (req, res, next) => {
    try{
        const resultado = await serviciosService.subirVideo(req.files, req.body.momento, req.params.id, req.usuario.id);

        res.status(201).json({
            message: 'Video subido correctamente',
            //id: resultado.id
            resultado
        });
        
    }catch(error){
        next(error);
    }
};

//*08*****************************************************************************************************************************
const solicitarCancelacion = async (req, res, next) => {
    try{
        const conductorId = req.usuario.id;
        const resultado = await serviciosService.solicitarCancelacion(req.body, conductorId);

        res.status(201).json({
            message: 'Solicitud de cancelación enviada correctamente',
            id: resultado.id
        })
    }catch (error){
        next(error);
    }
};

//*09*****************************************************************************************************************************
const cancelarServicio = async(req, res, next) => {
    try{
        const resultado = await serviciosService.cancelarServicio(req.params.id);

        res.json({
            message: 'Servicio cancelado con éxito',
            resultado
        });
    }catch(error){
        next(error);
    }
};

//*10*****************************************************************************************************************************
const rechazarSolicitudCancelacion = async (req, res, next) => {
    try{
        const { id } = req.params;

        const resultado = await serviciosService.rechazarSolicitudCancelacion(id);

        res.status(200).json({
            message: 'Solicitud de cancelación rechazada',
            cambios: resultado.cambios
        });
    }catch(error){
        next(error);
    }
};

//*11*****************************************************************************************************************************
const aprobarSolicitudCancelacion = async (req, res, next) => {
    try{
        const { id } = req.params;

        const resultado = await serviciosService.aprobarSolicitudCancelacion(id);

        res.status(200).json({
            message: 'Solicitud de cancelación aprobada',
            cambiosSolicitud: resultado.solicitudCambios,
            cambiosServicio: resultado.servicioCambios
        });
    }catch(error){
        next(error);
    }
};

//*12*****************************************************************************************************************************
module.exports = {
    obtenerServicios,
    crearServicio,
    reservarServicio,
    recogerServicio,
    entregarServicio,
    solicitarCancelacion,
    obtenerSolicitudes,
    rechazarSolicitudCancelacion,
    aprobarSolicitudCancelacion,
    cancelarServicio,
    subirFotos,
    subirVideo
};