const repostajesModel = require('../models/repostajes.model');
const serviciosModel = require('../models/servicios.model');
const crearError = require('../utils/httpErrors');
const estados = require('../constants/estados');

const obtenerServicioPorId = async (id) => {
    return await serviciosModel.obtenerServicioPorId(id);
}

const validarEstadoParaRepostaje = (servicio) => {
    if(servicio.estado_id !== estados.RECOGIDO){
        throw crearError('Solo se puede repostar cuando el servicio está RECOGIDO', 400);
    }
};

const crearRepostaje = async (idServicio, repostaje, idConductor) => {
    
    if(!Number.isInteger(Number(idServicio)) || Number(idServicio) <= 0){
        throw crearError('El ID del servicio no es válido', 400);
    }

    const servicio = await obtenerServicioPorId(idServicio);

    const ticket = repostaje.ticket.trim();

    const repostajeExistente =
    await repostajesModel.obtenerRepostajesPorTicket(
        idServicio,
        ticket
    );

    if(repostajeExistente){
        throw crearError(
            'Ya existe un repostaje con ese ticket para este servicio',
            409
        );
    }

    if(!servicio){
        throw crearError(`El servicio con ID ${idServicio} no existe`, 404);
    }

    validarEstadoParaRepostaje(servicio);

    if(repostaje.litros === undefined || repostaje.importe === undefined || typeof repostaje.ticket !== 'string' || repostaje.ticket.trim() === ''){
        throw crearError('Los litros, el importe y el ticket son obligatorios', 400);
    }

    if(typeof repostaje.litros !== 'number' || !Number.isFinite(repostaje.litros) || repostaje.litros <= 0){
        throw crearError('Litros deben ser un número mayor que cero (0)', 400);
    }

    if(repostaje.litros > 200){
        throw crearError('La cantidad de litros no puede superar los 200', 400);
    }

    if(repostaje.importe > 100){
        throw crearError('El importe no puede superar los 100 euros', 400);
    }

    if(typeof repostaje.importe !== 'number' || !Number.isFinite(repostaje.importe) || repostaje.importe <= 0){
        throw crearError('Importe debe ser un número mayor que cero (0)', 400);
    }

    if(servicio.conductor_id !== idConductor){
        throw crearError('No tienes permiso para registrar un repostaje de este servicio', 403);
    }

    const { servicio_id, ...datos } = repostaje;

    const datosRepostaje = {
        ...datos,
        servicio_id: idServicio,
        ticket
    };

    if(repostaje.observaciones !== undefined && typeof repostaje.observaciones !== 'string'){
        throw crearError('Las observaciones deben ser texto', 400);
    }

    return await repostajesModel.crearRepostaje(datosRepostaje);
}

const obtenerRepostajes = async () => {
    return await repostajesModel.obtenerRepostajes();
}

module.exports = {
    crearRepostaje,
    obtenerRepostajes
}