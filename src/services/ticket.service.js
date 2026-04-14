import prisma from '../models/prisma.model.js';

export const getTicketState = async (ticket_id) => {
  return await prisma.ticket.findUnique({
    select: {
      state: true,
    },
    where: { ticket_id },
  });
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

  if (!ticket) {
    return null;
  }

  return {
    ...ticket,
    clientimage: ticket.clientimage.map((image) => image.url_image),
    resolutionimage: ticket.resolutionimage.map((image) => image.url_image),
  };
};

export const getTickets = async (where, { skip, itemsPerPage } = {}) => {
  return await prisma.ticket.findMany({
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
    skip: skip || undefined,
    take: itemsPerPage || undefined,
  });
};

export const countFilteredTickets = async (where) => {
  return await prisma.ticket.count({
    where,
  });
};

export const createTicket = async ({ subject, description, user_id, category_id }) => {
  return await prisma.ticket.create({
    data: {
      subject,
      description,
      creation_date: new Date(),
      state: 'OPEN',
      category_id,
      user_id,
    },
  });
};

export const updateTicket = async (ticket_id, { state, resolution = null }) => {
  const data = { state };

  if (resolution) {
    data.resolution = resolution;
    data.resolution_date = new Date();
  }

  return await prisma.ticket.update({
    where: { ticket_id },
    data,
  });
};
