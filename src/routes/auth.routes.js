import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateLoginData, validateRegisterData } from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Guillem
 *         surname:
 *           type: string
 *           example: Rosell Sales
 *         email:
 *           type: string
 *           format: email
 *           example: guillem.rosell@example.com
 *         role:
 *           type: string
 *           enum: [CLIENT]
 *           example: CLIENT
 */

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints encargados del registro y acceso de usuarios al sistema.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevos clientes
 *     description: Crea un nuevo usuario con el rol de cliente.
 *     tags: [Autenticación]
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
 *               - password
 *               - role
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
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [CLIENT]
 *                 example: "CLIENT"
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito. Devuelve el token de acceso y los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJndWlsbGVyb3NzYWxAdW9jLmVkdSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3Mzc3OTc0NSwiZXhwIjoxNzczNzg2OTQ1fQ.Bnnw1ecP3Tz_w3PLHmCxKgpBW2yu9J_QXJX_s2rQBdU"
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserResponse'
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
 *                     - example: "El nombre es obligatorio."
 *                     - example: "Los apellidos son obligatorios."
 *                     - example: "El correo electrónico es obligatorio."
 *                     - example: "La contraseña es obligatoria."
 *                     - example: "El rol del usuario es obligatorio."
 *                     - example: "El formato del correo no es válido."
 *                     - example: "Solo se permite el registro de clientes."
 *                     - example: "El correo electrónico ingresado ya existe."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error durante el proceso de registro."
 */
router.post('/register', validateRegisterData, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     description: Inicia sesión con cualquier rol.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "guillem.rosell@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Sesión iniciada con éxito. Devuelve el token de acceso y los datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJndWlsbGVyb3NzYWxAdW9jLmVkdSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3Mzc3OTc0NSwiZXhwIjoxNzczNzg2OTQ1fQ.Bnnw1ecP3Tz_w3PLHmCxKgpBW2yu9J_QXJX_s2rQBdU"
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserResponse'
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
 *                     - example: "El correo electrónico es obligatorio."
 *                     - example: "La contraseña es obligatoria."
 *                     - example: "El formato del correo no es válido."
 *       401:
 *         description: Contraseña incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El usuario y la contraseña no coinciden."
 *       404:
 *         description: No existe el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El usuario y la contraseña no coinciden."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error durante el inicio de sesión."
 */
router.post('/login', validateLoginData, login);

export default router;
