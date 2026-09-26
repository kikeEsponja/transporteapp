const usuariosService = require('../services/usuarios.services');

const obtenerUsuarios = async (req, res, next) => {
    try{
        const usuarios = await usuariosService.obtenerUsuarios();

        res.json(usuarios);
    }catch(error){
        next(error);
    }
};

const obtenerUsuarioPorId = async (req, res, next) => {
    try{
        const { id } = req.params;

        const usuario = await usuariosService.obtenerUsuarioPorId(id);

        if(!usuario){
            return res.status(400).json({
                message: 'Usuario no encontrado'
            });
        }

        res.json(usuario);

    }catch(error){
        next(error);
    }
};

const crearUsuario = async (req, res) => {
    try{
        const resultado = await usuariosService.crearUsuario(req.body);
        
        res.status(201).json({
            message: 'Usuario creado correctamente',
            id: resultado.id
        });
    }catch(error){
        res.status(400).json({
            error: error.message
        });
    };
}

const actualizarUsuario = async (req, res) => {
    try{
        await usuariosService.actualizarUsuario(
            req.params.id,
            req.body
        );

        res.json({
            message: 'Usuario actualizado correctamente'
        });
    }catch(error){
        if(error.message === 'Usuario no encontrado'){
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(400).json({
            message: error.message
        });
    }
}

const eliminarUsuario = async (req, res) => {
    try{
        await usuariosService.eliminarUsuario(req.params.id);

        res.json({
            message: 'usuario eliminado correctamente'
        });
    }catch(error){
        if(error.message === 'Usuario no encontrado'){
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
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};