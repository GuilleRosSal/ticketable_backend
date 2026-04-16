import express from 'express';
import { getUserData, listEmails, updateUserData, updateUserPassword } from '../controllers/user.controller.js';
import { authenticateToken, isOwnerViaIdParam } from '../services/access.service.js';
import { validateUserId, validateUserPasswordData, validateUserProfileData } from '../validators/user.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints encargados de la obtención y edición de los datos de los usuarios.
 */

/**
 * @swagger
 * /user/emails:
 *   get:
 *     summary: Listado de correos electrónicos de los clientes
 *     description: Lista de los correos electrónicos de todos los clientes registrados en el sistema.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve la lista de correos electrónicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emails:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["guillem.rosell@example.com", "test@test.es"]
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
 *                   example: "Error al listar los correos electrónicos."
 */
router.get('/emails', authenticateToken, listEmails);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtiene los datos del usuario especificado
 *     description: Obtiene los datos del usuario especificado exceptuando la contraseña.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id del usuario.
 *           example: 1
 *     responses:
 *       200:
 *         description: Devuelve los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: ID inválido.
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se ha encontrado el usuario con id: 1."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al obtener los datos del usuario."
 */
router.get('/:id', authenticateToken, validateUserId, isOwnerViaIdParam, getUserData);

/**
 * @swagger
 * /user/{id}/profile-data:
 *   put:
 *     summary: Actualiza los datos del usuario especificado y renueva el token.
 *     description: Actualiza los datos del usuario especificado exceptuando la contraseña y renueva el token. Esta renovación se hace por si se actualiza el correo; ya que este es uno de los elementos utilizados en la creación del token de acceso y este se debe mantener actualizado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id del usuario.
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Guillem"
 *               surname:
 *                 type: string
 *                 example: "Rosell Sales"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "guillem.rosell@example.com"
 *     responses:
 *       200:
 *         description: Devuelve los datos del usuario actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJndWlsbGVyb3NzYWxAdW9jLmVkdSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3Mzc3OTc0NSwiZXhwIjoxNzczNzg2OTQ1fQ.Bnnw1ecP3Tz_w3PLHmCxKgpBW2yu9J_QXJX_s2rQBdU"
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: Error de validación o conflicto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "El parámetro ID debe ser un número entero positivo."
 *                     - example: "El nombre es obligatorio."
 *                     - example: "Los apellidos son obligatorios."
 *                     - example: "El correo electrónico es obligatorio."
 *                     - example: "El formato del correo no es válido."
 *                     - example: "El correo electrónico: guillem.rosell@example.com ya está en uso."
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se ha encontrado el usuario con id: 1."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar los datos del perfil del usuario."
 */
router.put(
  '/:id/profile-data',
  authenticateToken,
  validateUserId,
  isOwnerViaIdParam,
  validateUserProfileData,
  updateUserData,
);

/**
 * @swagger
 * /user/{id}/password:
 *   put:
 *     summary: Actualiza la contraseña del usuario especificado
 *     description: Actualiza la contraseña del usuario especificado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: Id del usuario
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "test1"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "test2"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "test2"
 *     responses:
 *       200:
 *         description: Devuelve un mensaje indicando que se ha actualizado correctamente la contraseña.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "La contraseña se ha actualizado correctamente."
 *       400:
 *         description: Error de validación o conflicto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   oneOf:
 *                     - example: "El parámetro ID debe ser un número entero positivo."
 *                     - example: "La antigua contraseña es obligatoria."
 *                     - example: "La nueva contraseña es obligatoria."
 *                     - example: "La confirmación de la nueva contraseña es obligatoria."
 *                     - example: "La nueva contraseña no puede ser igual a la antigua contraseña."
 *                     - example: "La nueva contraseña y su confirmación no coinciden."
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
 *                     - example: "La contraseña antigua es incorrecta."
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
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No se ha encontrado el usuario con id: 1."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al actualizar la contraseña del usuario."
 */
router.put(
  '/:id/password',
  authenticateToken,
  validateUserId,
  isOwnerViaIdParam,
  validateUserPasswordData,
  updateUserPassword,
);

export default router;
