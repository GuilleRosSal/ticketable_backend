import { generateToken } from '../services/access.service.js';
import { comparePassword, hashPassword } from '../services/password.service.js';
import {
  getClientEmails,
  getPassword,
  getProfileData,
  updatePassword,
  updateProfileData,
} from '../services/user.service.js';

export const getUserData = async (req, res) => {
  try {
    const user = await getProfileData(req.userId);

    if (!user) {
      return res.status(404).json({ error: `No se ha encontrado el usuario con id: ${req.userId}.` });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos del usuario.' });
  }
};

export const listEmails = async (req, res) => {
  try {
    const emails = await getClientEmails();

    res.status(200).json({ emails });
  } catch (error) {
    res.status(500).json({ error: 'Error al listar los correos electrónicos.' });
  }
};

export const updateUserData = async (req, res) => {
  const { name, surname, email } = req.body;

  try {
    const updatedUser = await updateProfileData(req.userId, { name, surname, email });

    const token = generateToken(updatedUser);

    res.status(200).json({ token, updatedUser });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: `El correo electrónico: ${email} ya está en uso.` });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ error: `No se ha encontrado el usuario con id: ${req.userId}.` });
    }

    res.status(500).json({ error: 'Error al actualizar los datos del perfil del usuario.' });
  }
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const dbPassword = await getPassword(req.userId);

    const passwordMatch = await comparePassword(oldPassword, dbPassword.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'La contraseña antigua es incorrecta.' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await updatePassword(req.userId, hashedPassword);

    res.status(200).json({ msg: 'La contraseña se ha actualizado correctamente.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `No se ha encontrado el usuario con id: ${req.userId}.` });
    }

    res.status(500).json({ error: 'Error al actualizar la contraseña del usuario.' });
  }
};
