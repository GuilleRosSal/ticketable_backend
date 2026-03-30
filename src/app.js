import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.config.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import imageRoutes from './routes/image.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/ticket', ticketRoutes);

//Documentation Routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//Routes for showing images
app.use('/image', imageRoutes);

export default app;
