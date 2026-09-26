const authService = require('../services/auth.services');

const login = async (req, res) => {
    try{
        const resultado = await authService.login(req.body);

        res.json(resultado);
        
    }catch(error){
        res.status(401).json({
            message: error.message
        });
    }
};

const registro = async (req, res, next) => {
    try{
        const resultado = await authService.registro(req.body);

        res.status(201).json(resultado);
    }catch(error){
        next(error);
    }
};

const regVehiculo = async (req, res, next) => {
    try{
        const resultado = await authService.regVehiculo(req.body);

        res.status(201).json(resultado);
    }catch(error){
        next(error);
    }
};

const regTienda = async (req, res, next) => {
    try{
        const resultado = await authService.regTienda(req.body);

        res.status(201).json(resultado);
    }catch(error){
        next(error);
    }
};

const solicitarRecuperacion = async (req, res, next) => {
    try{
        const resultado = await authService.solicitarRecuperacion(
            req.body.email
        );

        res.json(resultado);
    }catch(error){
        next(error);
    }
};

const restablecerPassword = async (req, res, next) => {
    try{
        const resultado = await authService.restablecerPassword(
            req.body.token,
            req.body.password
        );

        res.json(resultado);
    }catch(error){
        next(error);
    }
};

module.exports = {
    login,
    registro,
    regVehiculo,
    regTienda,
    solicitarRecuperacion,
    restablecerPassword
};