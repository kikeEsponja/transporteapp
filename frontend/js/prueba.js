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