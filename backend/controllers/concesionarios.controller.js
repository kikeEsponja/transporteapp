const tiendasService = require('../services/concesionarios.services');

const obtenerTiendas = async (req, res, next) => {
    try{
        const tiendas = await tiendasService.obtenerTiendas();

        res.json(tiendas);
    }catch(error){
        next(error);
    }
};

const obtenerTiendaPorId = async (req, res, next) => {
    try{
        const { id } = req.params;

        const tienda = await tiendasService.obtenerTiendaPorId(id);

        if(!tienda){
            return res.status(400).json({
                message: 'tienda no encontrada'
            });
        }

        res.json(tienda);

    }catch(error){
        next(error);
    }
};

const crearTienda = async (req, res) => {
    try{
        const resultado = await tiendasService.crearTienda(req.body);
        
        res.status(201).json({
            message: 'Tienda creada correctamente',
            id: resultado.id
        });
    }catch(error){
        res.status(400).json({
            error: error.message
        });
    };
}

const eliminarTienda = async (req, res) => {
    try{
        await tiendasService.eliminarTienda(req.params.id);

        res.json({
            message: 'tienda eliminada correctamente'
        });
    }catch(error){
        if(error.message === 'Tienda no encontrada'){
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
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    eliminarTienda
};