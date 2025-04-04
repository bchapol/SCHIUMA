const multer = require("multer");
const path = require("path");

const uploadPhotos = (rutaDestino) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, rutaDestino); // Usa la ruta proporcionada
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const fileFilter = (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Solo se permiten archivos de imagen (JPG, JPEG, PNG)"));
    };

    return multer({
        storage,
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter
    });
};

module.exports = uploadPhotos;
