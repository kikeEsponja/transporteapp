const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const enviarCorreoRecuperacion = async (email, enlace) => {
    const resultado = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Has solicitado restablecer tu contraseña. Pulsa el siguiente enlace para crear una nueva contraseña: ${enlace}. Este enlace caduca en 30 minutos. Si no has solicitado este cambio, puedes ignorar este correo.`
    });

    return resultado;
};

module.exports = {
    enviarCorreoRecuperacion
};