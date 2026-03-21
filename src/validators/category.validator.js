export const validateListSubcategoryByCategoryData = (req, res, next) => {
  try {
    req.decodedCategory = decodeURIComponent(req.params.category);
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Formato de categoría inválido.' });
  }
};
