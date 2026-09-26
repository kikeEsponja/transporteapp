const multer = require('multer');

const manejarError = (err, req, res, next) => {
    if(err instanceof multer.MulterError){
        return res.status(400).json({
            error: `Error al subir archivo: ${err.message}`
        });
    }

    if(err){
        return res.status(err.status || 500).json({
            error: err.message || 'Error interno del servidor'
        });
    }

    next();
};

module.exports = manejarError;