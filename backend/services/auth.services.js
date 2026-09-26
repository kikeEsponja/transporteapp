const bcrypt = require('bcrypt');
const usuariosModel = require('../models/usuarios.model');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const vehiculosModel = require('../models/vehiculos.model');
const tiendasModel = require('../models/concesionarios.model');
const crypto = require('crypto');
const recuperacionModel = require('../models/recup_pass.model');
const emailService = require('./email.services');

const login = async ({ email, password }) => {
    const usuario = await usuariosModel.obtenerUsuarioPorEmail(email);

//    console.log('USUARIO LOGIN', usuario);
//    console.log('ACTIVO', usuario?.activo);
//    console.log('TIPO ACTIVO:', typeof usuario?.activo);
    
    if(!usuario){
        throw new Error('Contraseña o correo incorrectos');
    }

    if(usuario.activo !== 1){
        throw new Error('El usuario está desactivado');
    }

    const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if(!passwordCorrecta){
        throw new Error('Correo o contrsaseña incorrectos');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        },
        jwtConfig.SECRET,
        {
            expiresIn: jwtConfig.EXPIRES_IN
        }
    )

    return {
        message: 'Login correcto',
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol
        }
    };
};

const registro = async ({ nombre, apellido, email, password, telefono }) => {
    const password_hash = await bcrypt.hash(password, 10);

    const usuario = {
        nombre,
        apellido,
        email,
        password_hash,
        telefono,
        rol: 'CONDUCTOR',
        activo: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    const resultado = await usuariosModel.crearUsuario(usuario);

    return{
        message: 'Usuario registrado correctamente',
        id: resultado.id
    };
};

const regVehiculo = async ({ matricula, marca, modelo, color, combustible, observaciones }) => {

    const vehiculo = {
        matricula,
        marca,
        modelo,
        color,
        combustible,
        observaciones
    };

    const resultado = await vehiculosModel.crearVehiculo(vehiculo);

    return{
        message: 'Vehículo registrado correctamente',
        id: resultado.id
    };
};

const regTienda = async ({ nombre, direccion, ciudad, telefono, horario }) => {

    const tienda = {
        nombre,
        direccion,
        ciudad,
        telefono,
        horario
    };

    const resultado = await tiendasModel.crearTienda(tienda);

    return{
        message: 'Tienda registrada correctamente',
        id: resultado.id
    };
};
/*--------------------------------------RECUPERACIÓN DE CONTRASEÑA--------------------------------------*/
const solicitarRecuperacion = async (email) => {

    const usuario = await usuariosModel.obtenerUsuarioPorEmail(email);

    if(!usuario){
        return{
            message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña'
        };
    }

    await recuperacionModel.invalidarSolicitudesPorUsuario(usuario.id);
    const token = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const expiresAt = new Date(
        Date.now() + 30 * 60 * 1000
    ).toISOString();

    const solicitud = {
        usuario_id: usuario.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
        usado: 0,
        created_at: new Date().toISOString()
    };

    await recuperacionModel.crearSolicitud(solicitud);

    //console.log('TOKEN DE RECUPERACIÓN: ', token);

    const enlace = `http://localhost:3000/vistas/recupera.html?token=${token}`;

    await emailService.enviarCorreoRecuperacion(
        usuario.email,
        enlace
    );

    return{
        message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
        //token
    };
};

const restablecerPassword = async (token, nuevaPassword) => {
    if(!token || !nuevaPassword){
        throw new Error('El token y la nueva contraseña son obligatorios');
    }

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    const solicitud = await recuperacionModel.obtenerSolicitudPorTokenHash(tokenHash);

    if(!solicitud){
        throw new Error('El enlace de recuperación no es válido');
    }

    if(solicitud.usado === 1){
        throw new Error('El enlace de recuperación ya ha sido utilizado');
    }

    if(new Date(solicitud.expires_at) < new Date()){
        throw new Error('El enlace de recuperación ha caducado');
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    const cambios = await usuariosModel.actualizarPassword(
        solicitud.usuario_id,
        passwordHash
    );

    if(cambios === 0){
        throw new Error('No se pudo actualizar la contraseña');
    }

    await recuperacionModel.marcarSolicitudComoUsada(solicitud.id);

    return{
        message: 'Contraseña actualizada correctamente'
    };
};

module.exports = {
    login,
    registro,
    regVehiculo,
    regTienda,
    solicitarRecuperacion,
    restablecerPassword
};