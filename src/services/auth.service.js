import prisma from '../models/prisma.model.js';

export async function createUser(user) {
  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: user.role,
    },
  });

  return createdUser;
}

export async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
}
