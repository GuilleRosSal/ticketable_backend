import express from 'express';

const router = express.Router();

/* This variables are deprecated in version 2.0.0
const CLIENT_IMAGES_URL = path.resolve(process.env.CLIENT_IMAGES_URL);
const RESOLUTION_IMAGES_URL = path.resolve(process.env.RESOLUTION_IMAGES_URL);
*/

/**
 * @swagger
 * tags:
 *   name: Imágenes
 *   description: "[DEPRECATED v2.0.0] Estos endpoints servían imágenes locales. Ahora las imágenes se sirven directamente a través de URLs de Cloudinary almacenadas en los objetos de la incidencia."
 */

/**
 * @swagger
 * /image/clientimage/{filename}:
 *   get:
 *     deprecated: true
 *     summary: "[DEPRECATED] Recuperar imagen adjunta por el cliente"
 *     description: Acceso directo al archivo físico de la imagen subida por el usuario al abrir el ticket (Obsoleto desde v2.0.0).
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo almacenado en el servidor.
 *         example: clientimage1_ticket1712073274285.png
 *     responses:
 *       200:
 *         description: Imagen encontrada. Retorna el archivo binario.
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: La imagen no existe en el servidor.
 *       410:
 *         description: El servidor ya no sirve archivos locales.
 */
router.get('/clientimage', (req, res) => {
  res.status(410).json({
    message: 'Este endpoint ha sido desactivado en la v2.0.0. Use la URL de Cloudinary proporcionada en el ticket.',
  });
});

/**
 * @swagger
 * /image/resolutionimage/{filename}:
 *   get:
 *     deprecated: true
 *     summary: "[DEPRECATED] Recuperar imagen de resolución del administrador"
 *     description: Acceso directo al archivo físico de la imagen subida por el administrador al resolver el ticket (Obsoleto desde v2.0.0).
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo almacenado en el servidor.
 *         example: resolutionimage1_ticket1712073274285.png
 *     responses:
 *       200:
 *         description: Imagen encontrada.
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: La imagen no existe.
 *       410:
 *         description: El servidor ya no sirve archivos locales.
 */
router.get('/resolutionimage', (req, res) => {
  res.status(410).json({
    message: 'Este endpoint ha sido desactivado en la v2.0.0. Use la URL de Cloudinary proporcionada en el ticket.',
  });
});

export default router;
