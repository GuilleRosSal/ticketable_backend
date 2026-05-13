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

export const createTicketWithImages = async ({ subject, description, user_id, category_id }, files) => {
  return await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: {
        subject,
        description,
        creation_date: new Date(),
        state: 'OPEN',
        category_id,
        user_id,
      },
    });

    let imageURLs = [];

    if (files && files.length > 0) {
      const imageData = files.map((file) => ({
        ticket_id: ticket.ticket_id,
        url_image: file.url,
      }));

      await tx.clientimage.createMany({
        data: imageData,
      });

      imageURLs = files.map((image) => image.url);
    }

    return { ticket, imageURLs };
  });
};

export const updateTicketWithImages = async (ticket_id, { state, resolution = null }, files) => {
  const data = { state };

  if (resolution) {
    data.resolution = resolution;
    data.resolution_date = new Date();
  }

  return await prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.update({
      where: { ticket_id },
      data,
    });

    let imageURLs = [];

    if (files && files.length > 0) {
      const imageData = files.map((file) => ({
        ticket_id,
        url_image: file.url,
      }));

      await tx.resolutionimage.createMany({
        data: imageData,
      });

      imageURLs = files.map((image) => image.url);
    }

    return { ticket, imageURLs };
  });
};
