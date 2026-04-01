import prisma from '../models/prisma.model.js';

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return categories;
};

export const getSubcategories = async () => {
  const subcategories = await prisma.category.findMany({
    select: {
      subcategory: true,
    },
  });

  return subcategories;
};

export const getSubcategoriesByCategory = async (category) => {
  const subcategories = await prisma.category.findMany({
    select: {
      subcategory: true,
    },
    where: { category },
  });

  return subcategories;
};

export const getCategoryIdBySubcategory = async (subcategory) => {
  const category = await prisma.category.findUnique({
    select: {
      id: true,
    },
    where: { subcategory },
  });

  return category;
};
