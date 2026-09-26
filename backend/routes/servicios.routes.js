const express = require('express');

const router = express.Router();

const serviciosController = require('../controllers/servicios.controller');

const tiposFotos = require('../constants/tiposFotos');
const { subirFotos } = require('../middleware/uploadFotos');

const verificarToken = require('../middleware/auth.middleware');
const verificarRol = require('../middleware/verificarRol');
const roles = require('../constants/roles');

const tipoVideo = require('../constants/tipoVideo');
const { subirVideo } = require('../middleware/uploadVideo');

router.get('/', verificarToken, serviciosController.obtenerServicios);
router.get('/solicitudes', verificarToken, verificarRol(roles.ADMIN), serviciosController.obtenerSolicitudes);

router.post('/', verificarToken, verificarRol(roles.ADMIN), serviciosController.crearServicio);

router.post('/:id/reservar', verificarToken, verificarRol(roles.CONDUCTOR), serviciosController.reservarServicio);
router.post('/:id/recoger', verificarToken, verificarRol(roles.CONDUCTOR), serviciosController.recogerServicio);
router.post('/:id/entregar', verificarToken, verificarRol(roles.CONDUCTOR), serviciosController.entregarServicio);
router.post('/:id/cancelar', verificarToken, verificarRol(roles.ADMIN), serviciosController.cancelarServicio);
router.post('/solicitud-cancelacion', verificarToken, verificarRol(roles.CONDUCTOR), serviciosController.solicitarCancelacion);
router.post('/solicitudes-cancelacion/:id/rechazar', verificarToken, verificarRol(roles.ADMIN), serviciosController.rechazarSolicitudCancelacion);
router.post('/solicitudes-cancelacion/:id/aprobar', verificarToken, verificarRol(roles.ADMIN), serviciosController.aprobarSolicitudCancelacion);
//router.patch('/cancelaciones/:idSolicitud', verificarToken, verificarRol(roles.ADMIN), serviciosController.responderSolicitudCancelacion);
router.post('/:id/fotos', verificarToken, verificarRol(roles.CONDUCTOR), subirFotos, serviciosController.subirFotos);
router.post('/:id/video', verificarToken, verificarRol(roles.CONDUCTOR), subirVideo, serviciosController.subirVideo);

module.exports = router;