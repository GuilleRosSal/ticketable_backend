import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_IMAGES_URL = process.env.CLIENT_IMAGES_URL;
const RESOLUTION_IMAGES_URL = process.env.RESOLUTION_IMAGES_URL;

//Routes
app.use('/auth', authRoutes);

//Documentation Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//Routes for images view
app.use('/view/imagescli', express.static(CLIENT_IMAGES_URL));
app.use('/view/imagesres', express.static(RESOLUTION_IMAGES_URL));

export default app;
