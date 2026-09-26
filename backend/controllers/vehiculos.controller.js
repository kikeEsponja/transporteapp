const vehiculosService = require('../services/vehiculos.services');

const obtenerVehiculos = async (req, res, next) => {
    try{
        const vehiculos = await vehiculosService.obtenerVehiculos();

        res.json(vehiculos);
    }catch(error){
        next(error);
    }
};

const obtenerVehiculoPorId = async (req, res, next) => {
    try{
        const { id } = req.params;

        const vehiculo = await vehiculosService.obtenerVehiculoPorId(id);

        if(!vehiculo){
            return res.status(400).json({
                message: 'Vehículo no encontrado'
            });
        }

        res.json(vehiculo);

    }catch(error){
        next(error);
    }
};

const crearVehiculo = async (req, res) => {
    try{
        const resultado = await vehiculosService.crearVehiculo(req.body);
        
        res.status(201).json({
            message: 'Vehículo creado correctamente',
            id: resultado.id
        });
    }catch(error){
        res.status(400).json({
            error: error.message
        });
    };
}

const eliminarVehiculo = async (req, res) => {
    try{
        await vehiculosService.eliminarVehiculo(req.params.id);

        res.json({
            message: 'vehículo eliminado correctamente'
        });
    }catch(error){
        if(error.message === 'Vehículo no encontrado'){
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(404).json({
            message: error.message
        });
    }
};

module.exports = { 
    obtenerVehiculos,
    obtenerVehiculoPorId,
    crearVehiculo,
    eliminarVehiculo
};