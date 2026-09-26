const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//const dbPath = path.resolve(__dirname, '../../database/schema.db'); para local
const dbPath = path.resolve(__dirname, '../database/schema.db'); //para render

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {
        console.error(err.message);
    } else {
        console.log("Base de datos conectada.");
    }

});

module.exports = db;