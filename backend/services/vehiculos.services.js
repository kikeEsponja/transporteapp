const vehiculosModel = require('../models/vehiculos.model');
const crearError = require('../utils/httpErrors');

const obtenerVehiculos = async () => {
    return await vehiculosModel.obtenerVehiculos();
};

const obtenerVehiculoPorId = async (id) => {
    return await vehiculosModel.obtenerVehiculoPorId(id);
}

const obtenerVehiculoPorMatricula = async (matricula) => {
    return await vehiculosModel.obtenerVehiculoPorMatricula(matricula);
}

const crearVehiculo = async (vehiculo) => {

    if(typeof vehiculo.marca !== 'string' || vehiculo.marca.trim() === ''){
        throw crearError('La marca es obligatoria', 400);
    }

    if(typeof vehiculo.modelo !== 'string' || vehiculo.modelo.trim() === ''){
        throw crearError('El modelo es obligatorio', 400);
    }

    if(typeof vehiculo.activo !== 'number'){
        throw crearError('El estado es obligatorio', 400);
    }

    if(typeof vehiculo.matricula !== 'string' || vehiculo.matricula.trim() === ''){
        throw crearError('La matricula es obligatoria', 400);
    }

    const vehiculoExistente = await vehiculosModel.obtenerVehiculoPorMatricula(vehiculo.matricula);

    if(vehiculoExistente){
        throw crearError('Ya existe un vehículo con esa matricula', 409);
    }

    const ahora = new Date().toISOString();

    vehiculo.created_at = ahora;
    vehiculo.updated_at = ahora;

    return await vehiculosModel.crearVehiculo(vehiculo);
}

const buscarVehiculoPorId = async (id) => {
    const vehiculo = await vehiculosModel.obtenerVehiculoPorId(id);

    if(!vehiculo){
        throw new Error('Vehículo no encontrado');
    }
    return vehiculo;
};

const eliminarVehiculo = async (id) => {

    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
        throw crearError('el id del vehículo no es válido', 400);
    }

    await buscarVehiculoPorId(id);

    return await vehiculosModel.eliminarVehiculo(id);
}

module.exports = {
    obtenerVehiculos,
    obtenerVehiculoPorId,
    obtenerVehiculoPorMatricula,
    buscarVehiculoPorId,
    crearVehiculo,
    eliminarVehiculo
};