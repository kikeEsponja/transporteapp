PRAGMA foreign_keys = ON;
CREATE TABLE usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    telefono TEXT NOT NULL,
    rol TEXT NOT NULL,
    activo BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
CREATE TABLE vehiculos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT NOT NULL UNIQUE,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    color TEXT NOT NULL,
    combustible TEXT NOT NULL,
    observaciones  TEXT
);
CREATE TABLE concesionarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    telefono TEXT NOT NULL,
    horario TEXT
);
CREATE TABLE estado_servicio(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado TEXT NOT NULL
);
CREATE TABLE servicios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha_publicacion DATETIME NOT NULL,
    fecha_reserva DATETIME,
    fecha_recogida DATETIME,
    fecha_entrega DATETIME,
    combustible_recogida TEXT NOT NULL,
    combustible_entrega TEXT NOT NULL,
    observaciones TEXT,
    conductor_id INTEGER NOT NULL,
    FOREIGN KEY (conductor_id)
        REFERENCES usuarios(id),
    vehiculo_id INTEGER NOT NULL,
    FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos(id),
    origen_id INTEGER NOT NULL,
    FOREIGN KEY (origen_id)
        REFERENCES concesionarios(id),
    destino_id INTEGER NOT NULL,
    FOREIGN KEY (destino_id)
        REFERENCES concesionarios(id),
    estado_id INTEGER NOT NULL,
    FOREIGN KEY (estado_id)
        REFERENCES estado_servicio(id)
);
CREATE TABLE fotos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    momento TEXT NOT NULL,
    tipo TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    servicio_id INTEGER NOT NULL,
    FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
);
CREATE TABLE gastos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    importe NUMERIC,
    ticket TEXT NOT NULL,
    observaciones TEXT,
    servicio_id INTEGER NOT NULL,
    FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
);