const express = require('express');
const verificarToken = require('../middleware/auth.middleware');
const verificarRol = require('../middleware/verificarRol');
const roles = require('../constants/roles');
const tiendasController = require('../controllers/concesionarios.controller');

const router = express.Router();

router.get('/', verificarToken, verificarRol(roles.ADMIN), tiendasController.obtenerTiendas);

router.get('/:id', verificarToken, verificarRol(roles.ADMIN), tiendasController.obtenerTiendaPorId);

router.post('/', verificarToken, verificarRol(roles.ADMIN), tiendasController.crearTienda);

router.delete('/:id', verificarToken, verificarRol(roles.ADMIN), tiendasController.eliminarTienda);

module.exports = router;