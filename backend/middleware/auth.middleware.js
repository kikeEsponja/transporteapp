const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const usuariosModel = require('../models/usuarios.model');

const verificarToken = async (req, res, next) => {
    const authHeader = (req.headers.authorization);

    if(!authHeader){
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: 'Token inválido'
        });
    }

    try{
        const payload = jwt.verify(
            token,
            jwtConfig.SECRET
        );

        const usuario = await usuariosModel.obtenerUsuarioPorId(payload.id);

        if(!usuario){
            return res.status(401).json({
                message: 'Usuario no encontrado'
            });
        }

        if(usuario.activo !== 1){
            return res.status(401).json({
                message: 'El usuario no está activo'
            });
        }

        req.usuario = payload;

        next();

    }catch(error){
        res.status(401).json({
            message: 'Token inválido'
        });
        return;
    }
};

module.exports = verificarToken;