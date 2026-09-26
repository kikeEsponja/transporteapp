const crearError = (mensaje, status = 500) => {
    const error = new Error(mensaje);
    error.status = status;

    return error;
};

module.exports = crearError;