const verificarRol = (rolPermitido) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                message: 'No estás autenticado'
            });
        }

        if (req.usuario.rol !== rolPermitido) {
            return res.status(403).json({
                message: 'No tienes permisos para acceder a este recurso'
            });
        }
        next();
    };
};

module.exports = verificarRol;