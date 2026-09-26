const emailService = require('./services/email.services');

const probarEmail = async () => {
    try{
        const resultado = await emailService.enviarCorreoRecuperacion(
            'element3999@gmail.com',
            'http://localhost:3000/recupera.html?token=ae6e034550da3a40687b9c35b2d70c0c3c5f8c5041b172a980448d55ffd38bad'
        );

        console.log('EMAIL ENVIADO CORRECTAMENTE');
        console.log('INFO: ', resultado);
    }catch(error){
        console.log('ERROR AL ENVIAR EMAIL: ');
        console.error(error);
    }
};

probarEmail();