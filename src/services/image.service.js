import fs from 'fs';
import multer from 'multer';
import path from 'path';

const UPLOAD_CONFIGS = {
  cli: { url: process.env.CLIENT_IMAGES_URL, prefix: 'clientimage' },
  res: { url: process.env.RESOLUTION_IMAGES_URL, prefix: 'resolutionimage' },
};

const VALID_FORMATS = {
  '.png': true,
  '.jpg': true,
  '.jpeg': true,
};

const MAX_FILES_SIZE = 5 * 1024 * 1024; // 5 MB

const createUploadMiddleware = (type) => {
  const config = UPLOAD_CONFIGS[type];

  const storage = multer.diskStorage({
    // Function to state the storage route
    destination: (req, file, cb) => {
      cb(null, config.url);
    },

    // Function to modify the file name
    filename: (req, file, cb) => {
      if (!req.fileIndex) {
        req.fileIndex = 1;
      }

      const ext = path.extname(file.originalname).toLowerCase();
      if (!VALID_FORMATS[ext]) {
        return cb(new Error('Formato de imagen no permitido'));
      }
      const filename = `${config.prefix}${req.fileIndex}_ticket${Date.now()}${ext}`;

      req.fileIndex++;

      cb(null, filename);
    },
  });

  return (req, res, next) => {
    multer({ storage }).array('images', 3)(req, res, (error) => {
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      next();
    });
  };
};

export const uploadClientImages = createUploadMiddleware('cli');
export const uploadResolutionImages = createUploadMiddleware('res');

export const checkImagesSize = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    const totalSize = req.files.reduce((accumulator, file) => accumulator + file.size, 0);

    if (totalSize > MAX_FILES_SIZE) {
      const error = new Error('El tamaño total de las imágenes no puede superar los 5MB');
      error.statusCode = 400;
      return next(error);
    }
  }

  next();
};

export const deleteImages = (files) => {
  if (files) {
    files.forEach((file) => {
      fs.unlink(path.normalize(file.path), (error) => {
        if (error) console.error('Error eliminando archivo:', error);
      });
    });
  }
};
