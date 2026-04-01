import express from 'express';
import { listCategories, listSubcategories, listSubcategoriesByCategory } from '../controllers/category.controller.js';
import { authenticateToken } from '../services/access.service.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints encargados de la obtención de los datos de las categorías.
 */

/**
 * @swagger
 * /category/categories:
 *   get:
 *     summary: Listado de categorías
 *     description: Lista las categorías principales almacenadas en la base de datos.
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve la lista de categorías principales.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                   example:
 *                     - category: "Accesibilidad y Autenticación"
 *                     - category: "Problemas Técnicos y Errores"
 *                     - category: "Seguridad y Datos"
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
 *                   example: "Error al intentar listar las categorías."
 */
router.get('/categories', authenticateToken, listCategories);

/**
 * @swagger
 * /category/subcategories:
 *   get:
 *     summary: Listado de subcategorías
 *     description: Lista las subcategorías almacenadas en la base de datos.
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve la lista de subcategorías.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subcategory:
 *                         type: string
 *                   example:
 *                     - subcategory: "No poder iniciar sesión o recuperar la contraseña"
 *                     - subcategory: "Errores al cargar o procesar datos"
 *                     - subcategory: "Accesos no autorizados o sospechosos"
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
 *                   example: "Error al intentar listar las subcategorías."
 */
router.get('/subcategories', authenticateToken, listSubcategories);

/**
 * @swagger
 * /category/subcategories/{category}:
 *   get:
 *     summary: Listado de subcategorías en función de la categoría principal
 *     description: Lista las subcategorías almacenadas en la base de datos en función de la categoría principal.
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           description: Nombre de la categoría principal.
 *           example: "Accesibilidad y Autenticación"
 *     responses:
 *       200:
 *         description: Devuelve la lista de subcategorías.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subcategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subcategory:
 *                         type: string
 *                   example:
 *                     - subcategory: "No poder iniciar sesión o recuperar la contraseña"
 *                     - subcategory: "Acceso denegado a ciertas secciones o funciones"
 *                     - subcategory: "Roles y permisos mal configurados"
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
 *                   example: "Error al intentar listar las subcategorías."
 */
router.get('/subcategories/:category', authenticateToken, listSubcategoriesByCategory);

export default router;
