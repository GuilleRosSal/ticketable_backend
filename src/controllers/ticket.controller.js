import { storeClientImages } from '../services/clientimage.service.js';
import { errorBuilder } from '../services/errorManagement.service.js';
import { storeResolutionImages } from '../services/resolutionimage.service.js';
import { createTicket, getTicket, getTickets, getTicketState, updateTicket } from '../services/ticket.service.js';

export const getStates = (req, res) => {
  const states = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  res.status(200).json({ states });
};

export const getTicketData = async (req, res) => {
  try {
    const ticket = await getTicket(req.ticketId);

    if (!ticket) {
      return res.status(404).json({ error: `No se ha encontrado la incidencia con id: ${req.ticketId}.` });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de la incidencia.' });
  }
};

export const getFilteredTickets = async (req, res) => {
  const filters = {
    category: req.query.category,
    subcategory: req.query.subcategory,
    email: req.query.email,
    state: req.query.state,
    creation_date: req.query.creation_date,
  };

  try {
    const tickets = await getTickets(filters);

    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el listado de incidencias.' });
  }
};

export const openTicket = async (req, res, next) => {
  const { subject, description } = req.body;
  const user_id = req.user.id;
  const category_id = req.category_id;

  try {
    const ticket = await createTicket({ subject, description, user_id, category_id });

    let imageURLs = [];
    if (req.files && req.files.length > 0) {
      imageURLs = await storeClientImages(ticket.ticket_id, req.files);
    }

    res.status(201).json({ ticket, imageURLs });
  } catch (error) {
    return next(errorBuilder('Error al abrir la incidencia.', 500));
  }
};

export const resolveTicket = async (req, res, next) => {
  const { state, resolution } = req.body;
  const ticket_id = req.ticketId;

  try {
    const ticketWithState = await getTicketState(ticket_id);

    if (!ticketWithState) {
      return next(errorBuilder(`No se ha encontrado la incidencia con id: ${ticket_id}.`, 404));
    }

    // Old vs new state validations
    if (ticketWithState.state === 'RESOLVED') {
      return next(errorBuilder('No se puede modificar una incidencia ya resuelta.', 400));
    }

    if (state === ticketWithState.state) {
      return next(errorBuilder('El estado de la incidencia no ha cambiado.', 400));
    }

    const ticket = await updateTicket(ticket_id, { state, resolution });

    let imageURLs = [];
    if (req.files && req.files.length > 0) {
      imageURLs = await storeResolutionImages(ticket_id, req.files);
    }

    res.status(200).json({ ticket, imageURLs });
  } catch (error) {
    return next(errorBuilder('Error al actualizar la incidencia.', 500));
  }
};
