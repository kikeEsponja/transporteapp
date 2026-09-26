const multer = require('multer');
const fs = require('fs');
const path = require('path');
const tiposFotos = require('../constants/tiposFotos');

const carpetaFotos = path.join(__dirname, '..', 'uploads', 'fotos');

if(!fs.existsSync(carpetaFotos)){
    fs.mkdirSync(carpetaFotos, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaFotos);
    },
    filename: function(req, file, cb){
        const extension = path.extname(file.originalname);

        cb(null, Date.now() + '-' + extension);
    }
});

const upload = multer({
    storage
});

const camposConfigurados = Object.values(tiposFotos).map(tipo => ({
    name: tipo,
    maxCount: 1
}));

const subirFotos = upload.fields(camposConfigurados);

module.exports = {
    subirFotos
}