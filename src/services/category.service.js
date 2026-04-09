import prisma from '../models/prisma.model.js';

export const getCategories = async () => {
  return await prisma.category.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });
};

export const getSubcategories = async () => {
  return await prisma.category.findMany({
    select: {
      subcategory: true,
    },
  });
};

export const getSubcategoriesByCategory = async (category) => {
  return await prisma.category.findMany({
    select: {
      subcategory: true,
    },
    where: { category },
  });
};

export const getCategoryId = async (category, subcategory) => {
  return await prisma.category.findUnique({
    select: {
      id: true,
    },
    where: { category, subcategory },
  });
};
