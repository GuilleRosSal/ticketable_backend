import prisma from '../models/prisma.model.js';

export const createUser = async (user) => {
  const createdUser = await prisma.user.create({
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

  return createdUser;
};

export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};
