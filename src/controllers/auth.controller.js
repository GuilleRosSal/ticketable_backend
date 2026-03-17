import { createUser, getUserByEmail } from '../services/auth.service.js';
import { comparePassword, hashPassword } from '../services/password.service.js';
import { generateToken } from '../services/token.service.js';

export const register = async (req, res) => {
  const { name, surname, email, password, role } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const user = {
      name,
      surname,
      email,
      password: hashedPassword,
      role,
    };

    const createdUser = await createUser(user);
    //Passwords should not be sent
    delete createdUser.password;

    const token = generateToken(createdUser);

    res.status(201).json({ token, user: createdUser });
  } catch (error) {
    console.log(error.meta);

    if (error.code === 'P2002') {
      res.status(400).json({ error: 'El correo electrónico ingresado ya existe.' });
      return;
    }

    res.status(500).json({ error: 'Error durante el proceso de registro.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      res.status(404).json({ error: 'El usuario y la contraseña no coinciden.' });
      return;
    }

    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'El usuario y la contraseña no coinciden.' });
      return;
    }

    //Passwords should not be sent
    delete user.password;

    const token = generateToken(user);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Error durante el inicio de sesión.' });
  }
};
