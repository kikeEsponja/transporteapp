const crearUsuario = async (usuario) => {
    usuario.rol = usuario.rol.trim().toUpperCase();
    usuario.nombre = usuario.nombre.trim();
    usuario.apellido = usuario.apellido.trim();
    usuario.email = usuario.email.trim().toLowerCase();
    usuario.telefono = usuario.telefono.trim();
    usuario.activo = 1;
    usuario.created_at = ahora;
    usuario.updated_at = ahora;
}