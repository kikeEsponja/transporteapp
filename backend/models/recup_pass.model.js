const db = require('../config/database');

const crearSolicitud = (solicitud) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO recuperaciones_password(usuario_id, token_hash, expires_at, usado, created_at) VALUES(?, ?, ?, ?, ?)`;

        db.run(
            sql,
            [
                solicitud.usuario_id,
                solicitud.token_hash,
                solicitud.expires_at,
                solicitud.usado,
                solicitud.created_at,
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

const obtenerSolicitudPorTokenHash = (tokenHash) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, usuario_id, token_hash, expires_at, usado, created_at FROM recuperaciones_password WHERE token_hash = ? LIMIT 1`;
        db.get(
            sql,            
            [tokenHash],
            (err, row) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }
            }
        );
    });
};

const invalidarSolicitudesPorUsuario = (usuarioId) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE recuperaciones_password SET usado = 1 WHERE usuario_id = ? AND usado = 0`;
        db.run(
            sql,
            [usuarioId],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }
            }
        );
    });
};

const marcarSolicitudComoUsada = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE recuperaciones_password SET usado = 1 WHERE id = ?`;
        db.run(
            sql,
            [id],
            function (err){
                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }
            }
        );
    });
};

module.exports = {
    crearSolicitud,
    obtenerSolicitudPorTokenHash,
    invalidarSolicitudesPorUsuario,
    marcarSolicitudComoUsada
};