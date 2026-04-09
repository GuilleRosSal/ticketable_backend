import prisma from '../models/prisma.model.js';

export const getProfileData = async (id) => {
  return await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
    },
    where: { id },
  });
};

export const getEmails = async () => {
  return await prisma.user.findMany({
    select: {
      email: true,
    },
    where: {
      role: 'CLIENT',
    },
  });
};

export const updateProfileData = async (id, { name, surname, email }) => {
  return await prisma.user.update({
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
    },
    where: { id },
    data: {
      name,
      surname,
      email,
    },
  });
};

export const updatePassword = async (id, hashedPassword) => {
  await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });
};

export const getPassword = async (id) => {
  return await prisma.user.findUnique({
    select: {
      password: true,
    },
    where: {
      id,
    },
  });
};
