const express = require('express');
const verificarToken = require('../middleware/auth.middleware');
const verificarRol = require('../middleware/verificarRol');
const roles = require('../constants/roles');
const usuariosController = require('../controllers/usuarios.controller');

const router = express.Router();

router.get('/', verificarToken, verificarRol(roles.ADMIN), usuariosController.obtenerUsuarios);

router.get('/:id', verificarToken, verificarRol(roles.ADMIN), usuariosController.obtenerUsuarioPorId);

router.post('/', verificarToken, verificarRol(roles.ADMIN), usuariosController.crearUsuario);

router.put('/:id', verificarToken, verificarRol(roles.ADMIN), usuariosController.actualizarUsuario);

router.delete('/:id', verificarToken, verificarRol(roles.ADMIN), usuariosController.eliminarUsuario);

module.exports = router;