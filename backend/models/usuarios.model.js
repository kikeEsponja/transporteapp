const db = require('../config/database');

const obtenerUsuarios = () => {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT id, nombre, apellido, email, telefono, rol, activo, created_at, updated_at FROM usuarios",
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

const obtenerUsuarioPorId = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, nombre, apellido, email, telefono, rol, activo, created_at, updated_at FROM usuarios WHERE id = ?",
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

const obtenerUsuarioPorEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT id, nombre, apellido, email, telefono, rol, activo, password_hash FROM usuarios WHERE email = ? LIMIT 1',
            [email],
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

const crearUsuario = (usuario) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO usuarios(
            nombre,
            apellido,
            email,
            password_hash,
            telefono,
            rol,
            activo,
            created_at,
            updated_at
        )
        VALUES(
            ?, ?, ?, ?, ?, ?, ?, ?, ?    
        )`;

        db.run(
            sql,
            [
                usuario.nombre,
                usuario.apellido,
                usuario.email,
                usuario.password_hash,
                usuario.telefono,
                usuario.rol,
                usuario.activo,
                usuario.created_at,
                usuario.updated_at
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

const actualizarUsuario = (id, usuario) => {

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
};

const eliminarUsuario = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE usuarios SET activo = 0, updated_at = ? WHERE id = ?',
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

const actualizarPassword = (id, passwordHash) => {

    return new Promise((resolve, reject) => {

        const sql = `
            UPDATE usuarios
            SET
            password_hash = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                passwordHash,
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
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorEmail,
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarPassword
};