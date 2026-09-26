//*REQUIRE***********************************************************************************************************************
const db = require('../config/database');
const estados = require('../constants/estados');
const ESTADOS = require('../constants/estados');
const estadosSolicitud = require('../constants/estados_solicitud');

//*01****************************************************************************************************************************
const obtenerServicios = () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT servicios.id, servicios.fecha_entrega, servicios.fecha_cancelacion, servicios.conductor_id, vehiculos.marca, vehiculos.modelo, vehiculos.matricula, origen.nombre AS origen, destino.nombre AS destino, estado_servicio.estado, usuarios.nombre, usuarios.apellido, solicitudes_cancelacion.estado_id AS estado_solicitud_cancelacion FROM servicios INNER JOIN vehiculos ON servicios.vehiculo_id = vehiculos.id INNER JOIN concesionarios AS origen ON servicios.origen_id = origen.id INNER JOIN concesionarios AS destino ON servicios.destino_id = destino.id INNER JOIN estado_servicio ON servicios.estado_id = estado_servicio.id LEFT JOIN usuarios ON servicios.conductor_id = usuarios.id LEFT JOIN solicitudes_cancelacion ON servicios.id = solicitudes_cancelacion.servicio_id',
            [],
            (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            }
        );
    });
};

const obtenerSolicitudes = () => {
    return new Promise((resolve, reject) => {
        db.all(
            //'SELECT solicitudes_cancelacion.id, solicitudes_cancelacion.motivo, usuarios.nombre AS nombre_conductor, estado_servicio.estado AS estado_del_servicio, estados_solicitud_cancelacion.estado AS estado_de_solicitud FROM solicitudes_cancelacion JOIN usuarios ON solicitudes_cancelacion.conductor_id = usuarios.id JOIN estado_servicio ON solicitudes_cancelacion.servicio_id = estado_servicio.id JOIN estados_solicitud_cancelacion ON solicitudes_cancelacion.estado_id = estados_solicitud_cancelacion.id',
            'SELECT solicitudes_cancelacion.id, solicitudes_cancelacion.motivo, usuarios.nombre AS nombre_conductor, estado_servicio.estado AS estado_del_servicio, estados_solicitud_cancelacion.estado AS estado_de_solicitud FROM solicitudes_cancelacion JOIN usuarios ON solicitudes_cancelacion.conductor_id = usuarios.id JOIN servicios ON solicitudes_cancelacion.servicio_id = servicios.id JOIN estado_servicio ON servicios.estado_id = estado_servicio.id JOIN estados_solicitud_cancelacion ON solicitudes_cancelacion.estado_id = estados_solicitud_cancelacion.id',
            [],
            (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            }
        );
    });
};

//*02****************************************************************************************************************************
const crearServicio = (servicio) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO servicios(
            fecha_publicacion,
            vehiculo_id,
            origen_id,
            destino_id,
            observaciones,
            estado_id
        )
        VALUES(
            ?, ?, ?, ?, ?, ?
        )`;

        db.run(
            sql,
            [
                new Date().toISOString(),
                servicio.vehiculo_id,
                servicio.origen_id,
                servicio.destino_id,
                servicio.observaciones,
                ESTADOS.PUBLICADO
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        id: this.lastID
                    });
                }
            }
        );
    });
};

//*03*****************************************************************************************************************************
const reservarServicio = (idServicio, idConductor) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE servicios SET conductor_id = ?, fecha_reserva = ?, fecha_asignacion = ?, estado_id = ? WHERE id = ? AND estado_id = ?`;

        const fechaReserva = new Date().toISOString();

        db.run(
            sql,
            [
                idConductor,
                fechaReserva,
                fechaReserva,
                ESTADOS.ASIGNADO,
                idServicio,
                ESTADOS.PUBLICADO
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        cambios: this.changes
                    });
                }
            }
        );
    });
};

//*04*****************************************************************************************************************************
const recogerServicio = (idServicio, combustibleRecogida) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE servicios SET fecha_recogida = ?, combustible_recogida = ?, estado_id = ? WHERE id = ? AND estado_id = ?`;

        db.run(
            sql,
            [
                new Date().toISOString(),
                combustibleRecogida,
                ESTADOS.RECOGIDO,
                idServicio,
                ESTADOS.ASIGNADO
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        cambios: this.changes
                    });
                }
            }
        );
    });
};

//*05*****************************************************************************************************************************
const entregarServicio = (idServicio, combustibleEntrega) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE servicios SET fecha_entrega = ?, combustible_entrega = ?, estado_id = ? WHERE id = ? AND estado_id = ?`;

        db.run(
            sql,
            [
                new Date().toISOString(),
                combustibleEntrega,
                ESTADOS.ENTREGADO,
                idServicio,
                ESTADOS.RECOGIDO
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        cambios: this.changes
                    });
                }
            }
        );
    });
};

//*06*****************************************************************************************************************************
const cancelarServicio = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE servicios SET estado_id = 5, fecha_cancelacion = ? WHERE id = ?',
            [new Date().toISOString(), id],
            function(err){
                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }
            }
        );
    });
};

//*07*****************************************************************************************************************************
const solicitarCancelacion = (solicitud) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO solicitudes_cancelacion(
            servicio_id,
            conductor_id,
            motivo,
            estado_id,
            created_at
        )
        VALUES(
            ?, ?, ?, ?, ?
        )`;

        db.run(
            sql,
            [
                solicitud.servicio_id,
                solicitud.conductor_id,
                solicitud.motivo,
                estadosSolicitud.PENDIENTE,
                new Date().toISOString()
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        id: this.lastID
                    });
                }
            }
        );
    });
};

//*08*****************************************************************************************************************************
const obtenerSolicitudCancelacionPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM solicitudes_cancelacion WHERE id = ?',
            [id],
            (err, row) => {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            }
        );
    });
};

const obtenerSolicitudPendientePorServicio = (servicioId) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT id, servicio_id, conductor_id, motivo, estado_id, created_at FROM solicitudes_cancelacion WHERE servicio_id = ? AND estado_id = ? LIMIT 1`;

        console.log('BUSCANDO SOLICITUD PENDIENTE');
        console.log('servicioId:', servicioId);
        console.log('estado pendiente:', estadosSolicitud.PENDIENTE);
        
        db.get(
            sql,
            [servicioId, estadosSolicitud.PENDIENTE],
            (err, row) => {
                if(err){
                    reject(err);
                }else{
                    console.log('SOLICITUD ENCONTRADA:', row);
                    resolve(row);
                }
            }
        )
    });
};

//*09*****************************************************************************************************************************
const aprobarSolicitudCancelacion = (idSolicitud) => {
    return new Promise((resolve, reject) => {

        db.serialize(() => {

            db.run('BEGIN TRANSACTION', (err) => {
                if(err){
                    return reject(err);
                }

                const sqlSolicitud = `UPDATE solicitudes_cancelacion SET estado_id = ? WHERE id = ?`;

                db.run(
                    sqlSolicitud,
                    [
                        estadosSolicitud.APROBADO,
                        idSolicitud
                    ],
                    function (err){
                        if(err){
                            return db.run('ROLLBACK', () => reject(err));
                        }
                        const cambiosSolicitud = this.changes;

                        const sqlServicio =`UPDATE servicios SET estado_id = ? WHERE id = (SELECT servicio_id FROM solicitudes_cancelacion WHERE id = ?)`;

                        db.run(
                            sqlServicio,
                            [
                                ESTADOS.CANCELADO,
                                idSolicitud
                            ],
                            function (err){
                                if(err){
                                    return db.run('ROLLBACK', () => reject(err));
                                }

                                const cambiosServicio = this.changes;

                                db.run('COMMIT', (err) => {
                                    if(err){
                                        return db.run(
                                            'ROLLBACK',
                                            () => reject(err)
                                        );
                                    }

                                    resolve({
                                        solicitudCambios: cambiosSolicitud,
                                        serviciosCambios: cambiosServicio
                                    });
                                });
                            }
                        );
                    }
                );
            });
        });
    });
}

//*10*****************************************************************************************************************************
const rechazarSolicitudCancelacion = (idSolicitud) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE solicitudes_cancelacion SET estado_id = ? WHERE id = ? AND estado_id = ?`;

        db.run(
            sql,
            [
                estadosSolicitud.RECHAZADO,
                idSolicitud,
                estadosSolicitud.PENDIENTE
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        cambios: this.changes
                    });
                }
            }
        );
    });
};

//*11*****************************************************************************************************************************
const subirFoto = (foto) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO fotos(
            momento,
            tipo,
            ruta,
            created_at,
            servicio_id
        )
        VALUES(?, ?, ?, ?, ?)`;

        db.run(
            sql,
            [
                foto.momento,
                foto.tipo,
                foto.ruta,
                new Date().toISOString(),
                foto.servicio_id
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        id: this.lastID
                    });
                }
            }
        );
    });
};

//*12*****************************************************************************************************************************
const subirVideo = (video) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO videos(
            momento,
            ruta,
            created_at,
            servicio_id
        )
        VALUES(?, ?, ?, ?)`;

        db.run(
            sql,
            [
                video.momento,
                video.ruta,
                new Date().toISOString(),
                video.servicio_id
            ],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve({
                        id: this.lastID
                    });
                }
            }
        );
    });
};

//*13*****************************************************************************************************************************
const obtenerServicioPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM servicios WHERE id = ?',
            [id],
            (err, row) => {
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            }
        );
    });
};

//*14*****************************************************************************************************************************
const obtenerEvidenciasServicio = (idServicio, momento) => {
    return new Promise((resolve, reject) => {
        const sqlFotos = `SELECT tipo FROM fotos WHERE servicio_id = ? AND momento = ?`;
        const sqlVideo = `SELECT id FROM videos WHERE servicio_id = ? AND momento = ? LIMIT 1`;
        db.all(
            sqlFotos,
            [idServicio, momento],
            (err, fotos) => {
                if(err){
                    return reject(err);
                }

                db.get(
                    sqlVideo,
                    [idServicio, momento],
                    (err, video) => {
                        if(err) {
                            return reject(err);
                        }

                        resolve({
                            fotos: fotos.map(foto => foto.tipo),
                            video: !!video
                        });
                    }
                );
            }
        );
    });
};

//*15*****************************************************************************************************************************
module.exports = {
    obtenerServicios,
    crearServicio,
    reservarServicio,
    recogerServicio,
    entregarServicio,
    cancelarServicio,
    obtenerSolicitudCancelacionPorId,
    solicitarCancelacion,
    obtenerSolicitudes,
    obtenerSolicitudPendientePorServicio,
    aprobarSolicitudCancelacion,
    rechazarSolicitudCancelacion,
    subirFoto,
    subirVideo,
    obtenerServicioPorId,
    obtenerEvidenciasServicio
}