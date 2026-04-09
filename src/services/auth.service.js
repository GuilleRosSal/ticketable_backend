import prisma from '../models/prisma.model.js';

export const createUser = async (user) => {
  return await prisma.user.create({
    data: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: user.role,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      role: true,
    },
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
