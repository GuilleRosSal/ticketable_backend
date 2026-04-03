import express from 'express';
import { findCategoryId } from '../controllers/category.controller.js';
import {
  getFilteredTickets,
  getStates,
  getTicketData,
  openTicket,
  resolveTicket,
} from '../controllers/ticket.controller.js';
import { authenticateToken, isAdmin, isClient } from '../services/access.service.js';
import { deleteImagesIfError } from '../services/errorManagement.service.js';
import { checkImagesSize, uploadClientImages, uploadResolutionImages } from '../services/image.service.js';
import {
  validateFilterQueryParams,
  validateTicketCreation,
  validateTicketId,
  validateTicketResolution,
} from '../validators/ticket.validator.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketDetailsResponse:
 *       type: object
 *       properties:
 *         ticket:
 *           type: object
 *           properties:
 *             ticket_id:
 *               type: integer
 *               example: 1
 *             subject:
 *               type: string
 *               example: "No me deja iniciar sesión en mi cuenta"
 *             description:
 *               type: string
 *               example: "Al intentar iniciar sesión en mi cuenta me dice que usuario y contraseña no coinciden y me ha bloqueado la cuenta."
 *             creation_date:
 *               type: string
 *               format: date-time
 *               example: 2026-04-02T15:54:34.285Z
 *             resolution_date:
 *               type: string
 *               format: date-time
 *               example: 2026-04-03T15:54:34.285Z
 *             state:
 *               type: string
 *               enum: [OPEN, IN_PROGRESS, RESOLVED]
 *               example: OPEN
 *             resolution:
 *               type: string
 *               example: "Se ha desbloqueado la cuenta y se le ha enviado un correo electrónico con la opción de recuperar contraseña."
 *             category_id:
 *               type: integer
 *               example: 4
 *             user_id:
 *               type: integer
 *               example: 7
 *             category:
 *               type: object
 *               properties:
 *                 category:
 *                   type: string
 *                   example: "Accesibilidad y Autenticación"
 *                 subcategory:
 *                   type: string
 *                   example: "No poder iniciar sesión o recuperar la contraseña"
 *             clientimage:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url_image:
 *                     type: string
 *                     example: "http://localhost:3000/image/clientimage/clientimage1_ticket1618033988749894848.png"
 *             resolutionimage:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url_image:
 *                     type: string
 *                     example: "http://localhost:3000/image/resolutionimage/resolutionimage1_ticket1618033988749894848.png"
 *             User:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: guillem.rosell@example.com
 *                 name:
 *                   type: string
 *                   example: Guillem
 *                 surname:
 *                   type: string
 *                   example: Rosell Sales
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FilteredTicketsResponse:
 *       type: object
 *       properties:
 *         tickets:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               subject:
 *                 type: string
 *                 example: "No me deja iniciar sesión en mi cuenta"
 *               state:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, RESOLVED]
 *                 example: OPEN
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-02T15:54:34.285Z
 *               category:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: "Accesibilidad y Autenticación"
 *                   subcategory:
 *                     type: string
 *                     example: "No poder iniciar sesión o recuperar la contraseña"
 *               User:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: guillem.rosell@example.com
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketCreationResponse:
 *       type: object
 *       properties:
 *         ticket:
 *           type: object
 *           properties:
 *             ticket_id:
 *               type: integer
 *               example: 1
 *             subject:
 *               type: string
 *               example: "No me deja iniciar sesión en mi cuenta"
 *             description:
 *               type: string
 *               example: "Al intentar iniciar sesión en mi cuenta me dice que usuario y contraseña no coinciden y me ha bloqueado la cuenta."
 *             creation_date:
 *               type: string
 *               format: date-time
 *               example: 2026-04-02T15:54:34.285Z
 *             resolution_date:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               example: null
 *             state:
 *               type: string
 *               enum: [OPEN]
 *               example: OPEN
 *             resolution:
 *               type: string
 *               nullable: true
 *               example: null
 *             category_id:
 *               type: integer
 *               example: 4
 *             user_id:
 *               type: integer
 *               example: 7
 *         imageURLs:
 *           type: array
 *           items:
 *             type: string
 *             example: "http://localhost:3000/image/clientimage/clientimage1_ticket1618033988749894848.png"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketResolutionResponse:
 *       type: object
 *       properties:
 *         ticket:
 *           type: object
 *           properties:
 *             ticket_id:
 *               type: integer
 *               example: 1
 *             subject:
 *               type: string
 *               example: "No me deja iniciar sesión en mi cuenta"
 *             description:
 *               type: string
 *               example: "Al intentar iniciar sesión en mi cuenta me dice que usuario y contraseña no coinciden y me ha bloqueado la cuenta."
 *             creation_date:
 *               type: string
 *               format: date-time
 *               example: 2026-04-02T15:54:34.285Z
 *             resolution_date:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               example: 2026-04-03T15:54:34.285Z
 *             state:
 *               type: string
 *               enum: [IN_PROGRESS, RESOLVED]
 *               example: RESOLVED
 *             resolution:
 *               type: string
 *               nullable: true
 *               example: "Se ha desbloqueado la cuenta y se le ha enviado un correo electrónico con la opción de recuperar contraseña."
 *             category_id:
 *               type: integer
 *               example: 4
 *             user_id:
 *               type: integer
 *               example: 7
 *         imageURLs:
 *           type: array
 *           items:
 *             type: string
 *             example: "http://localhost:3000/image/resolutionimage/resolutionimage1_ticket1618033988749894848.png"
 */

/**
 * @swagger
 * tags:
 *   name: Incidencias
 *   description: Endpoints relacionados con la gestión de incidencias.
 */

/**
 * @swagger
 * /ticket/states:
 *   get:
 *     summary: Listado de estados de las incidencias
 *     description: Lista de los posibles estados de las incidencias.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve la lista de estados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 states:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [OPEN, IN_PROGRESS, RESOLVED]
 *                   example:
 *                     - OPEN
 *                     - IN_PROGRESS
 *                     - RESOLVED
 *       401:
 *         description: Usuario no autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "No autorizado."
 *                     - example: "Sesión caducada."
 *       403:
 *         description: Acceso restringido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso restringido."
 */
router.get('/states', authenticateToken, getStates);

/**
 * @swagger
 * /ticket/{id}:
 *   get:
 *     summary: Datos completos de una incidencia
 *     description: Devuelve los datos completos de una incidencia específica. Se incluyen los datos de la propia incidencia; su resolución; imágenes de clientes y resolución; y el nombre, apellidos y correo electrónico del cliente.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id del ticket.
 *           example: 1
 *     responses:
 *       200:
 *         description: Devuelve los datos de la incidencia.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketDetailsResponse'
 *       400:
 *         description: Id inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El parámetro ID debe ser un número entero positivo."
 *       401:
 *         description: Usuario no autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "No autorizado."
 *                     - example: "Sesión caducada."
 *       403:
 *         description: Acceso restringido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso restringido."
 *       404:
 *         description: Incidencia no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se ha encontrado la incidencia con id: 1."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener los datos de la incidencia."
 */
router.get('/:id', authenticateToken, validateTicketId, getTicketData);

/**
 * @swagger
 * /ticket/:
 *   get:
 *     summary: Listado de incidencias con opciones de filtrado.
 *     description: Devuelve una lista de incidencias filtradas según los parámetros proporcionados.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           description: Categoría de la incidencia.
 *           example: "Accesibilidad y Autenticación"
 *       - in: query
 *         name: subcategory
 *         required: false
 *         schema:
 *           type: string
 *           description: Subcategoría de la incidencia.
 *           example: "No poder iniciar sesión o recuperar la contraseña"
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *           description: Correo electrónico del cliente que abrió la incidencia.
 *           example: "guillem.rosell@example.com"
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED]
 *           description: Estado de la incidencia.
 *           example: "OPEN"
 *       - in: query
 *         name: creation_date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la incidencia.
 *           example: 2026-04-02T15:54:34.285Z
 *     responses:
 *       200:
 *         description: Devuelve la lista de incidencias filtradas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilteredTicketsResponse'
 *       400:
 *         description: Parámetros de filtrado inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "El formato del correo no es válido."
 *                     - example: "El estado indicado no es válido."
 *       401:
 *         description: Usuario no autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "No autorizado."
 *                     - example: "Sesión caducada."
 *       403:
 *         description: Acceso restringido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso restringido."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener el listado de incidencias."
 */
router.get('/', authenticateToken, validateFilterQueryParams, getFilteredTickets);

/**
 * @swagger
 * /ticket/:
 *   post:
 *     summary: Crea una nueva incidencia.
 *     description: Crea una nueva incidencia con los datos proporcionados. Se pueden incluir imágenes relacionadas con la incidencia.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - subcategory
 *               - subject
 *               - description
 *             properties:
 *               category:
 *                 type: string
 *                 description: Categoría de la incidencia.
 *                 example: "Accesibilidad y Autenticación"
 *               subcategory:
 *                 type: string
 *                 description: Subcategoría de la incidencia.
 *                 example: "No poder iniciar sesión o recuperar la contraseña"
 *               subject:
 *                 type: string
 *                 description: Asunto de la incidencia.
 *                 example: "No me deja iniciar sesión en mi cuenta"
 *               description:
 *                 type: string
 *                 description: Descripción detallada de la incidencia.
 *                 example: "Al intentar iniciar sesión en mi cuenta me dice que usuario y contraseña no coinciden y me ha bloqueado la cuenta."
 *               images:
 *                 type: array
 *                 maxItems: 3
 *                 description: Imágenes relacionadas con la incidencia. Se pueden subir hasta 3 imágenes.
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Devuelve los datos de la incidencia creada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketCreationResponse'
 *       400:
 *         description: Formato de imagen no permitido o tamaño de imágenes excedido. Campos obligatorios no proporcionados. Categoría no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "Formato de imagen no permitido."
 *                     - example: "El tamaño total de las imágenes no puede superar los 5MB."
 *                     - example: "La categoría es obligatoria."
 *                     - example: "La subcategoría es obligatoria."
 *                     - example: "El asunto es obligatorio."
 *                     - example: "La descripción es obligatoria."
 *                     - example: "No se ha encontrado la combinación de categoría y subcategoría especificada."
 *       401:
 *         description: Usuario no autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "No autorizado."
 *                     - example: "Sesión caducada."
 *       403:
 *         description: Acceso restringido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso restringido."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "Error al intentar obtener el id de la categoría especificada."
 *                     - example: "Error al abrir la incidencia."
 *                     - example: "Se ha producido un error en el servidor."
 */
router.post(
  '/',
  authenticateToken,
  isClient,
  uploadClientImages,
  checkImagesSize,
  validateTicketCreation,
  findCategoryId,
  openTicket,
  deleteImagesIfError,
);

/**
 * @swagger
 * /ticket/{id}:
 *   put:
 *     summary: Actualiza el estado de la incidencia y permite realizar su resolución.
 *     description: Actualiza el estado de la incidencia y permite añadir su resolución. Se pueden incluir imágenes relacionadas con la resolución.
 *     tags: [Incidencias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id del ticket.
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [IN_PROGRESS, RESOLVED]
 *                 description: Nuevo estado de la incidencia.
 *                 example: "RESOLVED"
 *               resolution:
 *                 type: string
 *                 description: Resolución de la incidencia. Es obligatoria si el estado es RESOLVED y no se puede proporcionar si el estado es IN_PROGRESS.
 *                 example: "Se ha desbloqueado la cuenta y se le ha enviado un correo electrónico con la opción de recuperar contraseña."
 *               images:
 *                 type: array
 *                 maxItems: 3
 *                 description: Imágenes relacionadas con la resolución. Se pueden subir hasta 3 imágenes.
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Devuelve los datos de la incidencia y su resolución (si aplica).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResolutionResponse'
 *       400:
 *         description: Formato de imagen no permitido o tamaño de imágenes excedido. Campos obligatorios no proporcionados. Categoría no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "El parámetro ID debe ser un número entero positivo."
 *                     - example: "Formato de imagen no permitido."
 *                     - example: "El tamaño total de las imágenes no puede superar los 5MB."
 *                     - example: "El estado es obligatorio."
 *                     - example: "El estado indicado no es válido."
 *                     - example: "La resolución es obligatoria cuando se resuelve una incidencia."
 *                     - example: "Para proporcionar una resolución es necesario resolver la incidencia."
 *                     - example: "Para proporcionar imágenes de resolución es necesario resolver la incidencia."
 *                     - example: "No se puede modificar una incidencia ya resuelta."
 *                     - example: "El estado de la incidencia no ha cambiado."
 *       401:
 *         description: Usuario no autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "No autorizado."
 *                     - example: "Sesión caducada."
 *       403:
 *         description: Acceso restringido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acceso restringido."
 *       404:
 *         description: Incidencia no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se ha encontrado la incidencia con id: 1."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "Error al actualizar la incidencia."
 *                     - example: "Se ha producido un error en el servidor."
 */
router.put(
  '/:id',
  authenticateToken,
  isAdmin,
  validateTicketId,
  uploadResolutionImages,
  checkImagesSize,
  validateTicketResolution,
  resolveTicket,
  deleteImagesIfError,
);

export default router;
