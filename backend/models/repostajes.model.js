const db = require('../config/database');

const obtenerRepostajes = () => {
    return new Promise((resolve, reject) => {
        db.all(
            'SELECT repostajes.id, repostajes.servicio_id, repostajes.litros, repostajes.importe, repostajes.ticket, repostajes.observaciones, repostajes.created_at, vehiculos.matricula, vehiculos.marca, vehiculos.modelo, usuarios.id AS conductor_id, usuarios.nombre AS conductor_nombre, usuarios.apellido AS conductor_apellido FROM repostajes INNER JOIN servicios ON repostajes.servicio_id = servicios.id INNER JOIN vehiculos ON servicios.vehiculo_id = vehiculos.id LEFT JOIN usuarios ON servicios.conductor_id = usuarios.id;',
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

const obtenerRepostajesPorTicket = (servicioId, ticket) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM repostajes WHERE servicio_id = ? AND ticket = ? LIMIT 1`,
            [servicioId, ticket],
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

const crearRepostaje = (repostaje) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO repostajes(
            litros,
            importe,
            ticket,
            observaciones,
            created_at,
            servicio_id
        )
        VALUES(
            ?, ?, ?, ?, ?, ?
        )`;

        db.run(
            sql,
            [
                repostaje.litros,
                repostaje.importe,
                repostaje.ticket,
                repostaje.observaciones,
                new Date().toISOString(),
                repostaje.servicio_id
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

module.exports = {
    obtenerRepostajes,
    crearRepostaje,
    obtenerRepostajesPorTicket
}