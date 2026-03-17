import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateLoginData, validateRegisterData } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRegisterData, register);
router.post('/login', validateLoginData, login);

export default router;
