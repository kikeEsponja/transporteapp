const db = require('../config/database');

const obtenerTiendas = () => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT id, nombre, direccion, ciudad, telefono, horario FROM concesionarios",
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

const obtenerTiendaPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, nombre, direccion, ciudad, telefono, horario FROM concesionarios WHERE id = ?",
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

const obtenerTiendaPorNombre = (nombre) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, nombre, direccion, ciudad, telefono, horario FROM concesionarios WHERE nombre = ?',
            [nombre],
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

const crearTienda = (tienda) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO concesionarios(
            nombre,
            direccion,
            ciudad,
            telefono,
            horario
        )
        VALUES(
            ?, ?, ?, ?, ?
        )`;

        db.run(
            sql,
            [
                tienda.nombre,
                tienda.direccion,
                tienda.ciudad,
                tienda.telefono,
                tienda.horario
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

const eliminarTienda = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE concesionarios SET activo = 0, updated_at = ? WHERE id = ?',
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
    obtenerTiendas,
    obtenerTiendaPorId,
    obtenerTiendaPorNombre,
    crearTienda,
    eliminarTienda
};