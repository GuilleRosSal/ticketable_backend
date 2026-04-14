import prisma from '../models/prisma.model.js';

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return categories.map((item) => item.category);
};

export const getSubcategories = async () => {
  const subcategories = await prisma.category.findMany({
    select: {
      subcategory: true,
    },
  });

  return subcategories.map((item) => item.subcategory);
};

export const getSubcategoriesByCategory = async (category) => {
  const subcategories = await prisma.category.findMany({
    select: {
      subcategory: true,
    },
    where: { category },
  });

  return subcategories.map((item) => item.subcategory);
};

export const getCategoryId = async (category, subcategory) => {
  return await prisma.category.findUnique({
    select: {
      id: true,
    },
    where: { category, subcategory },
  });
};
