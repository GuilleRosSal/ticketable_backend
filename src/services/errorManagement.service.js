import { deleteImages } from './image.service.js';

export const deleteImagesIfError = (error, req, res, next) => {
  if (req.files && req.files.length > 0) {
    deleteImages(req.files);
  }
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || 'Se ha producido un error en el servidor' });
};
