const db = require('../config/database');

const obtenerVehiculos = () => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT id, matricula, marca, modelo, color, combustible, observaciones, activo FROM vehiculos ORDER BY marca ASC, modelo ASC, matricula ASC",
            [],
            (err, rows) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            }
        );
    });
};

const obtenerVehiculoPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, matricula, marca, modelo, color, combustible, observaciones, activo FROM vehiculos WHERE id = ?",
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

const obtenerVehiculoPorMatricula = (matricula) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, matricula, marca, modelo, color, combustible, observaciones, activo FROM vehiculos WHERE matricula = ? LIMIT 1',
            [matricula],
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

const crearVehiculo = (vehiculo) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO vehiculos(
            matricula,
            marca,
            modelo,
            color,
            combustible,
            observaciones,
            activo
        )
        VALUES(
            ?, ?, ?, ?, ?, ?, ?    
        )`;

        db.run(
            sql,
            [
                vehiculo.matricula,
                vehiculo.marca,
                vehiculo.modelo,
                vehiculo.color,
                vehiculo.combustible,
                vehiculo.observaciones,
                vehiculo.activo
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

/*const actualizarUsuario = (id, usuario) => {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE usuarios
            SET
                nombre = ?,
                apellido = ?,
                email = ?,
                telefono = ?,
                rol = ?,
                activo = ?,
                updated_at = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                usuario.nombre,
                usuario.apellido,
                usuario.email,
                usuario.telefono,
                usuario.rol,
                usuario.activo,
                usuario.updated_at,
                id
            ],
            function(err){

                if(err){
                    reject(err);
                }else{
                    resolve(this.changes);
                }

            }
        );
    });
};*/

const eliminarVehiculo = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE vehiculos SET activo = 0, updated_at = ? WHERE id = ?',
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

module.exports = {
    obtenerVehiculos,
    obtenerVehiculoPorId,
    obtenerVehiculoPorMatricula,
    crearVehiculo,
    eliminarVehiculo
};