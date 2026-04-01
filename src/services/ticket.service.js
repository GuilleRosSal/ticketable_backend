import prisma from '../models/prisma.model.js';

export const getTicketState = async (ticket_id) => {
  const ticket = await prisma.ticket.findUnique({
    select: {
      state: true,
    },
    where: { ticket_id },
  });

  return ticket;
};

export const getTicket = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    select: {
      ticket_id: true,
      subject: true,
      description: true,
      creation_date: true,
      resolution_date: true,
      state: true,
      resolution: true,
      category_id: true,
      user_id: true,
      category: {
        select: {
          category: true,
          subcategory: true,
        },
      },
      clientimage: {
        select: {
          url_image: true,
        },
      },
      resolutionimage: {
        select: {
          url_image: true,
        },
      },
      User: {
        select: {
          email: true,
          name: true,
          surname: true,
        },
      },
    },
    where: {
      ticket_id: id,
    },
  });

  return ticket;
};

export const getTickets = async ({ category, subcategory, email, state, creation_date }) => {
  const where = {};

  if (category || subcategory) {
    where.category = {};
    if (category) where.category.category = category;
    if (subcategory) where.category.subcategory = subcategory;
  }

  if (email) where.User = { email };
  if (state) where.state = state;
  if (creation_date) {
    const dateFilter = new Date(creation_date);
    where.creation_date = {
      lte: dateFilter,
    };
  }

  const tickets = await prisma.ticket.findMany({
    select: {
      ticket_id: true,
      subject: true,
      state: true,
      creation_date: true,
      category: {
        select: {
          category: true,
          subcategory: true,
        },
      },
      User: {
        select: {
          email: true,
        },
      },
    },
    where,
  });

  return tickets;
};

export const createTicket = async ({ subject, description, user_id, category_id }) => {
  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      creation_date: new Date(),
      state: 'OPEN',
      category_id,
      user_id,
    },
  });

  return ticket;
};

export const updateTicket = async (ticket_id, { state, resolution = null }) => {
  const data = { state };

  if (resolution) {
    data.resolution = resolution;
    data.resolution_date = new Date();
  }

  const updatedTicket = await prisma.ticket.update({
    where: { ticket_id },
    data,
  });

  return updatedTicket;
};
