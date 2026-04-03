import { errorBuilder } from '../services/errorManagement.service.js';
import { isEmail } from './shared.validator.js';

const validStates = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

const validUpdateStates = ['IN_PROGRESS', 'RESOLVED'];

const isValidState = (state) => {
  return validStates.includes(state);
};

const isValidUpdateState = (state) => {
  return validUpdateStates.includes(state);
};

export const validateTicketId = (req, res, next) => {
  const numericId = Number(req.params.id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return res.status(400).json({ error: 'El parámetro ID debe ser un número entero positivo.' });
  }

  req.ticketId = numericId;

  next();
};

export const validateFilterQueryParams = (req, res, next) => {
  const { email, state } = req.query;

  if (email && !isEmail(email)) {
    return res.status(400).json({ error: 'El formato del correo no es válido.' });
  }

  if (state && !isValidState(state)) {
    return res.status(400).json({ error: 'El estado indicado no es válido.' });
  }

  next();
};

export const validateTicketCreation = (req, res, next) => {
  const { category, subcategory, subject, description } = req.body || {};

  const requiredFields = [
    { val: category, msg: 'La categoría es obligatoria.' },
    { val: subcategory, msg: 'La subcategoría es obligatoria.' },
    { val: subject, msg: 'El asunto es obligatorio.' },
    { val: description, msg: 'La descripción es obligatoria.' },
  ];

  // Required field validations
  const error = requiredFields.find((field) => !field.val?.trim());
  if (error) {
    return next(errorBuilder(error.msg, 400));
  }

  next();
};

export const validateTicketResolution = (req, res, next) => {
  const { state, resolution } = req.body || {};

  if (!state?.trim()) {
    return next(errorBuilder('El estado es obligatorio.', 400));
  }

  if (!isValidUpdateState(state)) {
    return next(errorBuilder('El estado indicado no es válido.', 400));
  }

  if (state === 'RESOLVED') {
    if (!resolution?.trim()) {
      return next(errorBuilder('La resolución es obligatoria cuando se resuelve una incidencia.', 400));
    }
  } else {
    if (resolution) {
      return next(errorBuilder('Para proporcionar una resolución es necesario resolver la incidencia.', 400));
    }
    if (req.files && req.files.length > 0) {
      return next(errorBuilder('Para proporcionar imágenes de resolución es necesario resolver la incidencia.', 400));
    }
  }

  next();
};
