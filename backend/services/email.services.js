//const nodemailer = require('nodemailer');
const { Resend } = require('resend');

require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

/*const transporter = nodemailer.createTransport({
    //service: 'gmail', funciona en local
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});*/

const enviarCorreoRecuperacion = async (email, enlace) => {
    const resultado = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Has solicitado restablecer tu contraseña. Pulsa el siguiente enlace para crear una nueva contraseña: ${enlace}. Este enlace caduca en 30 minutos. Si no has solicitado este cambio, puedes ignorar este correo.`
    });

    return resultado;
};

module.exports = {
    enviarCorreoRecuperacion
};