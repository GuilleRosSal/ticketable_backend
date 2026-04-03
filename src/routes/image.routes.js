import express from 'express';
import path from 'path';

const router = express.Router();

const CLIENT_IMAGES_URL = path.resolve(process.env.CLIENT_IMAGES_URL);
const RESOLUTION_IMAGES_URL = path.resolve(process.env.RESOLUTION_IMAGES_URL);

/**
 * @swagger
 * tags:
 *   name: Imágenes
 *   description: Endpoints que permiten el acceso a las imágenes de las incidencias y resoluciones.
 */

/**
 * @swagger
 * /image/clientimage/{filename}:
 *   get:
 *     summary: Recuperar imagen adjunta por el cliente
 *     description: Acceso directo al archivo físico de la imagen subida por el usuario al abrir el ticket.
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
 */
router.use('/clientimage', express.static(CLIENT_IMAGES_URL));

/**
 * @swagger
 * /image/resolutionimage/{filename}:
 *   get:
 *     summary: Recuperar imagen de resolución del administrador
 *     description: Acceso directo al archivo físico de la imagen subida por el administrador al resolver el ticket.
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
 */
router.use('/resolutionimage', express.static(RESOLUTION_IMAGES_URL));

export default router;
