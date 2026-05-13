import { deleteImages, deleteImagesFromCloudinary } from './image.service.js';

export const deleteImagesIfError = (error, req, res, next) => {
  if (req.files && req.files.length > 0) {
    deleteImages(req.files);
  }
  if (req.cloudinaryFiles && req.cloudinaryFiles.length > 0) {
    // Not using await to respond faster to the user, as the deletion process doesn't affect the response flow.
    deleteImagesFromCloudinary(req.cloudinaryFiles);
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Se ha producido un error en el servidor.' });
};

export const errorBuilder = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
