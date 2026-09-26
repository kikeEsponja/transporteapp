const usuariosModel = require('../models/usuarios.model');
const bcrypt = require('bcrypt');
const roles = require('../constants/roles');
const crearError = require('../utils/httpErrors');

const obtenerUsuarios = async () => {
    return await usuariosModel.obtenerUsuarios();
};

const obtenerUsuarioPorId = async (id) => {
    return await usuariosModel.obtenerUsuarioPorId(id);
}

const obtenerUsuarioPorEmail = async (email) => {
    return await usuariosModel.obtenerUsuarioPorEmail(email);
}

const crearUsuario = async (usuario) => {

    if(typeof usuario.rol !== 'string'){
        throw crearError('el rol es obligatorio', 400);
    }

    usuario.rol = usuario.rol.trim().toUpperCase();
    usuario.email = usuario.email.trim().toLowerCase();

    if(typeof usuario.nombre !== 'string' || usuario.nombre.trim() === ''){
        throw crearError('El nombre es obligatorio', 400);
    }

    if(typeof usuario.apellido !== 'string' || usuario.apellido.trim() === ''){
        throw crearError('El apellido es obligatorio', 400);
    }

    if(typeof usuario.email !== 'string' || usuario.email.trim() === ''){
        throw crearError('El correo electrónico es obligatorio', 400);
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailValido.test(usuario.email)){
        throw crearError('El correo electrónico no es válido', 400);
    }

    const usuarioExistente = await usuariosModel.obtenerUsuarioPorEmail(usuario.email);

    if(usuarioExistente){
        throw crearError('Ya existe un usuario con ese email', 409);
    }

    if(typeof usuario.password !== 'string' || usuario.password.trim() === ''){
        throw crearError('La contraseña es obligatoria', 400);
    }

    if(usuario.password.length < 6){
        throw crearError('la contraseña debe tener al menos seis (6) caracteres', 400);
    }

    if(usuario.rol !== roles.ADMIN && usuario.rol !== roles.CONDUCTOR){
        throw crearError('el rol no es válido', 400);
    }

    if(usuario.telefono !== undefined && usuario.telefono !== null){
        if(typeof usuario.telefono !== 'string'){
            throw crearError('El teléfono debe ser texto', 400);
        }
        usuario.telefono = usuario.telefono.trim();

        if(usuario.telefono === ''){
            usuario.telefono = null;
        }
    }

    const existe = await usuariosModel.obtenerUsuarioPorEmail(usuario.email);

    if(existe){
        throw new Error('El correo ya está registrado');
    }
    
    const saltRows = 10;
    usuario.password_hash = await bcrypt.hash(
        usuario.password_hash,
        saltRows
    )

    const ahora = new Date().toISOString();

    usuario.created_at = ahora;
    usuario.updated_at = ahora;

    return await usuariosModel.crearUsuario(usuario);
}

const buscarUsuarioPorId = async (id) => {
    const usuario = await usuariosModel.obtenerUsuarioPorId(id);

    if(!usuario){
        throw new Error('Usuario no encontrado');
    }
    return usuario;
};

const actualizarUsuario = async (id, datos) => {

    await buscarUsuarioPorId(id);

    if(
        typeof datos.nombre !== 'string' ||
        datos.nombre.trim() === ''
    ){
        throw crearError('El nombre es obligatorio', 400);
    }

    if(
        typeof datos.apellido !== 'string' ||
        datos.apellido.trim() === ''
    ){
        throw crearError('El apellido es obligatorio', 400);
    }

    if(
        typeof datos.email !== 'string' ||
        datos.email.trim() === ''
    ){
        throw crearError('El email es obligatorio', 400);
    }

    datos.nombre = datos.nombre.trim();
    datos.apellido = datos.apellido.trim();
    datos.email = datos.email.trim().toLowerCase();

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailValido.test(datos.email)){
        throw crearError('El email no es válido', 400);
    }

    const usuarioConEseEmail =
        await usuariosModel.obtenerUsuarioPorEmail(datos.email);

    if(
        usuarioConEseEmail &&
        usuarioConEseEmail.id !== Number(id)
    ){
        throw crearError(
            'Ya existe un usuario con ese email',
            409
        );
    }

    if(
        typeof datos.rol !== 'string'
    ){
        throw crearError('El rol es obligatorio', 400);
    }

    datos.rol = datos.rol.trim().toUpperCase();

    if(
        datos.rol !== roles.ADMIN &&
        datos.rol !== roles.CONDUCTOR
    ){
        throw crearError('El rol no es válido', 400);
    }

    if(
        datos.telefono !== undefined &&
        datos.telefono !== null
    ){

        if(typeof datos.telefono !== 'string'){
            throw crearError(
                'El teléfono debe ser texto',
                400
            );
        }

        datos.telefono = datos.telefono.trim();

        if(datos.telefono === ''){
            datos.telefono = null;
        }
    }

    if(datos.activo !== 0 && datos.activo !== 1){
        throw crearError('El estado activo debe ser 0 o 1', 400);
    }

    datos.updated_at = new Date().toISOString();

    return await usuariosModel.actualizarUsuario(id, datos);
};

const eliminarUsuario = async (id) => {

    if(!Number.isInteger(Number(id)) || Number(id) <= 0){
        throw crearError('el id del usuario no es válido', 400);
    }

    await buscarUsuarioPorId(id);

    return await usuariosModel.eliminarUsuario(id);
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    buscarUsuarioPorId,
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario
};