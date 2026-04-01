import {
  getCategories,
  getCategoryIdBySubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
} from '../services/category.service.js';
import { errorBuilder } from '../services/errorManagement.service.js';

export const listCategories = async (req, res) => {
  try {
    const categories = await getCategories();

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar listar las categorías.' });
  }
};

export const listSubcategories = async (req, res) => {
  try {
    const subcategories = await getSubcategories();

    res.status(200).json({ subcategories });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar listar las subcategorías.' });
  }
};

export const listSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await getSubcategoriesByCategory(req.params.category);

    res.status(200).json({ subcategories });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar listar las subcategorías.' });
  }
};

export const getCategoryId = async (req, res, next) => {
  try {
    const category = await getCategoryIdBySubcategory(req.body.subcategory);

    req.category_id = category.id;

    next();
  } catch (error) {
    return next(errorBuilder('Error al intentar obtener el id de la categoría especificada.', 500));
  }
};
