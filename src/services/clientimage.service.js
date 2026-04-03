import prisma from '../models/prisma.model.js';

export const storeClientImages = async (ticket_id, files) => {
  const BACKEND_URL = process.env.BACKEND_URL;

  const imageData = files.map((file) => ({
    ticket_id,
    url_image: `${BACKEND_URL}/image/clientimage/${file.filename}`,
  }));

  await prisma.clientimage.createMany({
    data: imageData,
  });

  return imageData.map((image) => image.url_image);
};
