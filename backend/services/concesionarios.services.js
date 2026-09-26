const tiendasModel = require('../models/concesionarios.model');
const crearError = require('../utils/httpErrors');

const obtenerTiendas = async () => {
    return await tiendasModel.obtenerTiendas();
};

const obtenerTiendaPorId = async (id) => {
    return await tiendasModel.obtenerTiendaPorId(id);
}

const obtenerTiendaPorNombre = async (nombre) => {
    return await tiendasModel.obtenerTiendaPorNombre(nombre);
}

const crearTienda = async (tienda) => {

    if(typeof tienda.nombre !== 'string' || tienda.nombre.trim() === ''){
        throw crearError('El nombre es obligatorio', 400);
    }

    if(typeof tienda.direccion !== 'string' || tienda.direccion.trim() === ''){
        throw crearError('La dirección es obligatoria', 400);
    }

    if(typeof tienda.ciudad !== 'string' || tienda.ciudad.trim() === ''){
        throw crearError('La cidad es obligatoria', 400);
    }

    if(typeof tienda.telefono !== 'string' || tienda.telefono.trim() === ''){
        throw crearError('El teléfono es obligatorio', 400);
    }

    if(typeof tienda.horario !== 'string' || tienda.horario.trim() === ''){
        throw crearError('El horario es obligatorio', 400);
    }

    const tiendaExistente = await tiendasModel.obtenerTiendaPorNombre(tienda.nombre);

    if(tiendaExistente){
        throw crearError('Ya existe una tienda con ese nombre', 409);
    }

    const ahora = new Date().toISOString();

    tienda.created_at = ahora;
    tienda.updated_at = ahora;

    return await tiendasModel.crearTienda(tienda);
}

const buscarTiendaPorId = async (id) => {
    const tienda = await tiendasModel.obtenerTiendaPorId(id);

    if(!tienda){
        throw new Error('Tienda no encontrada');
    }
    return tienda;
};

const eliminarTienda = async (id) => {

    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
        throw crearError('el id de la tienda no es válido', 400);
    }

    await buscarTiendaPorId(id);

    return await tiendasModel.eliminarTienda(id);
}

module.exports = {
    obtenerTiendas,
    obtenerTiendaPorId,
    obtenerTiendaPorNombre,
    buscarTiendaPorId,
    crearTienda,
    eliminarTienda
};