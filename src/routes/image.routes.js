import express from 'express';
import path from 'path';

const router = express.Router();

const CLIENT_IMAGES_URL = path.resolve(process.env.CLIENT_IMAGES_URL);
const RESOLUTION_IMAGES_URL = path.resolve(process.env.RESOLUTION_IMAGES_URL);

router.use('/clientimage', express.static(CLIENT_IMAGES_URL));
router.use('/resolutionimage', express.static(RESOLUTION_IMAGES_URL));

export default router;
