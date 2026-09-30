const login = async ({ email, password }) => {
    const usuario = await usuariosModel.obtenerUsuarioPorEmail(email);    
    if(!usuario){
        throw new Error('Contraseña o correo incorrectos');
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

    // const enlace = `http://localhost:3000/vistas/recupera.html?token=${token}`; // para local
    const enlace = `https://transporteapp-backend.onrender.com/vistas/recupera.html?token=${token}`; // para remoto

    await emailService.enviarCorreoRecuperacion(
        usuario.email,
        enlace
    );

    return{
        message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
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