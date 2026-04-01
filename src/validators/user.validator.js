import { isEmail } from './shared.validator.js';

export const validateUserId = (req, res, next) => {
  const numericId = Number(req.params.id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({ error: 'El parámetro ID debe ser un número entero positivo.' });
  }

  req.userId = numericId;

  next();
};

export const validateUserProfileData = (req, res, next) => {
  const { name, surname, email } = req.body;

  const requiredFields = [
    { val: name, msg: 'El nombre es obligatorio.' },
    { val: surname, msg: 'Los apellidos son obligatorios.' },
    { val: email, msg: 'El correo electrónico es obligatorio.' },
  ];

  // Required field validations
  const error = requiredFields.find((field) => !field.val?.trim());
  if (error) {
    return res.status(400).json({ error: error.msg });
  }

  // Extra validations
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'El formato del correo no es válido.' });
  }

  next();
};

export const validateUserPasswordData = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const requiredFields = [
    { val: oldPassword, msg: 'La antigua contraseña es obligatoria.' },
    { val: newPassword, msg: 'La nueva contraseña es obligatoria.' },
    { val: confirmPassword, msg: 'La confirmación de la nueva contraseña es obligatoria.' },
  ];

  // Required field validations
  const error = requiredFields.find((field) => !field.val?.trim());
  if (error) {
    return res.status(400).json({ error: error.msg });
  }

  // Extra validations
  if (oldPassword === newPassword) {
    return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la antigua contraseña.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'La nueva contraseña y su confirmación no coinciden.' });
  }

  next();
};
