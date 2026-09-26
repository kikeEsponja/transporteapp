const multer = require('multer');
const fs = require('fs');
const path = require('path');
const tipoVideo = require('../constants/tipoVideo');

const carpetaVideos = path.join(__dirname, '..', 'uploads', 'videos');

if(!fs.existsSync(carpetaVideos)){
    fs.mkdirSync(carpetaVideos, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, carpetaVideos);
    },
    filename: function(req, file, cb){
        const extension = path.extname(file.originalname);

        cb(null, Date.now() + '-' + extension);
    }
});

const upload = multer({
    storage
});

const camposConfigurados = Object.values(tipoVideo).map(tipo => ({
    name: tipo,
    maxCount: 1
}));

const subirVideo = upload.fields(camposConfigurados);

module.exports = {
    subirVideo
}