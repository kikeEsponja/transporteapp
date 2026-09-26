const express = require('express');
const usuarioRoutes = require('./routes/usuarios.routes');
const db = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');
const serviciosRoutes = require('./routes/servicios.routes');
const manejarError = require('./middleware/error.middleware');
const repostajesRoutes = require('./routes/repostajes.routes');
const vehiculosRoutes = require('./routes/vehiculos.routes');
const tiendasRoutes = require('./routes/concesionarios.routes');
const solicitudCancelacion = require('./routes/servicios.routes');

const path = require('path');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://trasladoscontrol.netlify.app']
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(
  path.join(__dirname, '../frontend')
));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', '/vistas', 'index.html'));
});

app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/repostajes', repostajesRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/tiendas', tiendasRoutes);
app.use('/cancelar', serviciosRoutes);
app.use('/solicitud-cancelacion', solicitudCancelacion);

/*app.get("/", (req, res) => {
    res.json({
        proyecto: 'Sistema de transporte',
        version: '1.0.0',
        estado: 'Ok'
    });
});*/

app.get("/health", (req, res) => {
  res.json({
    'status': db.status,
    'database': db,
    'uptime': 328,
    'timestamp': '2026-07-03T14:30:15Z'
  });
});

app.use(manejarError);

module.exports = app;