import express from 'express';
import { getCategoryId } from '../controllers/category.controller.js';
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

router.get('/states', authenticateToken, getStates);
router.get('/:id', authenticateToken, validateTicketId, getTicketData);
router.get('/', authenticateToken, validateFilterQueryParams, getFilteredTickets);
router.post(
  '/',
  authenticateToken,
  isClient,
  uploadClientImages,
  checkImagesSize,
  validateTicketCreation,
  getCategoryId,
  openTicket,
  deleteImagesIfError,
);
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
