import prisma from '../models/prisma.model.js';

export const getProfileData = async (id) => {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
    },
    where: { id },
  });

  return user;
};

export const getEmails = async () => {
  const emails = await prisma.user.findMany({
    select: {
      email: true,
    },
    where: {
      role: 'CLIENT',
    },
  });

  return emails;
};

export const updateProfileData = async (id, { name, surname, email }) => {
  const updatedUser = await prisma.user.update({
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

  return updatedUser;
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
  const password = await prisma.user.findUnique({
    select: {
      password: true,
    },
    where: {
      id,
    },
  });

  return password;
};
