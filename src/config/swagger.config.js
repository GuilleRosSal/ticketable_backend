import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticketable API',
      version: '1.0.0',
      description: 'Ticket management API - TFM',
      contact: {
        name: 'Guillem Rosell Sales',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://future-publication-site:3000', //TODO Servidor donde se publique el backend.
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['src/routes/*.js'],
};

const swaggerSpecs = swaggerJSDoc(options);
export default swaggerSpecs;
