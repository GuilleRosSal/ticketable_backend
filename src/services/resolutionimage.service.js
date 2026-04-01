import prisma from '../models/prisma.model';

export const storeResolutionImages = async (ticket_id, files) => {
  const BACKEND_URL = process.env.BACKEND_URL;

  const imageData = files.map((file) => ({
    ticket_id,
    url_image: `${BACKEND_URL}/image/resolutionimage/${file.filename}`,
  }));

  await prisma.resolutionimage.createMany({
    data: imageData,
  });

  return imageData.map((image) => image.url_image);
};
