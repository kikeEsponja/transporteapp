const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);

router.post('/registro', authController.registro);

router.post('/olvido-password', authController.solicitarRecuperacion);

router.post('/restablecer-password', authController.restablecerPassword);

module.exports = router;