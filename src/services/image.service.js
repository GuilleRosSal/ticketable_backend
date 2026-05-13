import fs from 'fs';
import multer from 'multer';
import path from 'path';
import cloudinary from '../config/cloudinary.config.js';
import { errorBuilder } from './errorManagement.service.js';

/* Deprecated since version 2.0.0
const UPLOAD_CONFIGS = {
  cli: { url: process.env.CLIENT_IMAGES_URL, prefix: 'clientimage' },
  res: { url: process.env.RESOLUTION_IMAGES_URL, prefix: 'resolutionimage' },
};
*/

const UPLOAD_CONFIGS = {
  cli: { prefix: 'clientimage' },
  res: { prefix: 'resolutionimage' },
};

const TEMP_UPLOAD_URL = process.env.IMG_STORAGE;

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
      cb(null, TEMP_UPLOAD_URL);
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
      const filePath = path.normalize(file.path);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (error) => {
          if (error) console.error('Error eliminando archivo:', error);
        });
      }
    });
  }
};

// Cloudinary image management functions
export const uploadImagesToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();
  req.cloudinaryFiles = [];

  try {
    for (const image of req.files) {
      const folderName = image.filename.startsWith('clientimage') ? 'client' : 'resolution';

      const result = await cloudinary.uploader.upload(image.path, {
        folder: `tfm_tickets/${folderName}`,
        resource_type: 'auto',
      });

      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      req.cloudinaryFiles.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    next();
  } catch (error) {
    return next(errorBuilder('Error al subir las imágenes', 500));
  }
};

export const deleteImagesFromCloudinary = async (cloudinaryFiles) => {
  if (cloudinaryFiles) {
    try {
      for (const image of cloudinaryFiles) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    } catch (error) {
      console.error('Error al eliminar de Cloudinary:', error);
    }
  }
};
