const repostajesService = require('../services/repostajes.services');

const obtenerRepostajes = async (req, res, next) => {
    try{
        const repostajes = await repostajesService.obtenerRepostajes();

        res.json(repostajes);
        
    }catch(error){
        next(error)
    }
};

const crearRepostaje = async (req, res, next) => {
    try{
        const resultado = await repostajesService.crearRepostaje(req.params.id, req.body, req.usuario.id);

        res.status(201).json({
            message: 'Repostaje creado correctamente',
            id: resultado.id
        });
        
    }catch(error){
        next(error);
    }
};

module.exports = {
    obtenerRepostajes,
    crearRepostaje
};