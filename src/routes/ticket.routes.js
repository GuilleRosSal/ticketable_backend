import express from 'express';
import { getStates } from '../controllers/ticket.controller.js';
import { authenticateToken, isAdmin } from '../services/access.service.js';
import { deleteImagesIfError } from '../services/errorManagement.service.js';
import { checkImagesSize, uploadClientImages, uploadResolutionImages } from '../services/image.service.js';

const router = express.Router();

router.get('/states', authenticateToken, getStates);
router.get('/:id', authenticateToken, () => {});
router.get('/', authenticateToken, () => {});
router.post('/', authenticateToken, uploadClientImages, checkImagesSize, () => {}, deleteImagesIfError);
router.put('/:id', authenticateToken, isAdmin, uploadResolutionImages, checkImagesSize, () => {}, deleteImagesIfError);

export default router;
