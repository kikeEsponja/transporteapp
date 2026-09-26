app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

//send a message "database connected" to the console when the connection is established
/*app.get("/db", (req, res) => {
  const db = require('./config/database');
    db.on('open', () => {
        console.log('Connected to the SQLite database.');
        res.send("Database connected successfully");
    });
});*/