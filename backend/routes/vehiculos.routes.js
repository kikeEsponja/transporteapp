const express = require('express');
const verificarToken = require('../middleware/auth.middleware');
const verificarRol = require('../middleware/verificarRol');
const roles = require('../constants/roles');
const vehiculosController = require('../controllers/vehiculos.controller');

const router = express.Router();

router.get('/', verificarToken, verificarRol(roles.ADMIN), vehiculosController.obtenerVehiculos);

router.get('/:id', verificarToken, verificarRol(roles.ADMIN), vehiculosController.obtenerVehiculoPorId);

router.post('/', verificarToken, verificarRol(roles.ADMIN), vehiculosController.crearVehiculo);

router.delete('/:id', verificarToken, verificarRol(roles.ADMIN), vehiculosController.eliminarVehiculo);

module.exports = router;