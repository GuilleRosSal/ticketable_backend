import { isEmail, validRole } from './shared.validator.js';

export const validateRegisterData = (req, res, next) => {
  const { name, surname, email, password, role } = req.body;

  const requiredFields = [
    { val: name, msg: 'El nombre es obligatorio.' },
    { val: surname, msg: 'Los apellidos son obligatorios.' },
    { val: email, msg: 'El correo electrónico es obligatorio.' },
    { val: password, msg: 'La contraseña es obligatoria.' },
    { val: role, msg: 'El rol del usuario es obligatorio.' },
  ];

  // Required field validations
  const error = requiredFields.find((f) => !f.val || f.val.trim() === '');
  if (error) {
    return res.status(400).json({ error: error.msg });
  }

  // Extra validations
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'El formato del correo no es válido.' });
  }

  if (!validRole(role)) {
    return res.status(400).json({ error: 'Solo se permite el registro de clientes.' });
  }

  next();
};

export const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;

  const requiredFields = [
    { val: email, msg: 'El correo electrónico es obligatorio.' },
    { val: password, msg: 'La contraseña es obligatoria.' },
  ];

  // Required field validations
  const error = requiredFields.find((f) => !f.val || f.val.trim() === '');
  if (error) {
    return res.status(400).json({ error: error.msg });
  }

  // Extra validations
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'El formato del correo no es válido.' });
  }

  next();
};
