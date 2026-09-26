const express = require('express');
const verificarToken = require('../middleware/auth.middleware');
const verificarRol = require('../middleware/verificarRol');
const roles = require('../constants/roles');

const router = express.Router();

const repostajesController = require('../controllers/repostajes.controller');

router.get('/', verificarToken, verificarRol(roles.ADMIN), repostajesController.obtenerRepostajes);
router.post('/:id/repostar', verificarToken, verificarRol(roles.CONDUCTOR), repostajesController.crearRepostaje);

module.exports = router;