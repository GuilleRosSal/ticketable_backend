import prisma from '../models/prisma.model.js';

export const storeClientImages = async (ticket_id, files) => {
  const imageData = files.map((file) => ({
    ticket_id,
    url_image: file.url,
  }));

  await prisma.clientimage.createMany({
    data: imageData,
  });

  return imageData.map((image) => image.url_image);
};
