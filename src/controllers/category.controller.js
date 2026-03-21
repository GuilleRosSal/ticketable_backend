import { getCategories, getSubcategories, getSubcategoriesByCategory } from '../services/category.service.js';

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
    const subcategories = await getSubcategoriesByCategory(req.decodedCategory);

    res.status(200).json({ subcategories });
  } catch (error) {
    res.status(500).json({ error: 'Error al intentar listar las subcategorías.' });
  }
};
