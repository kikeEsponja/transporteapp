const { RECOGIDO } = require('./constants/estados');
const serviciosService = require('./services/servicios.services');

const probar = async () => {
    try{
        const resultado = await serviciosService.validarEvidencias(
            2,
            'prueba'
        );

        console.log('Validación de evidencias');
        console.log(resultado);
    }catch(error){
        console.error('Error: ', error.message);
    }
};

probar();