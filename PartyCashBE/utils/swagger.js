const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Party Budgeting API',
    version: '1.0.0',
    description: 'API for managing a shared party budget, deposits, withdrawals, and user authentication',
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production'
        ? `https://${process.env.DOMAIN_NAME}:${process.env.HTTPS_PORT}`
        : `http://localhost:${process.env.PORT}`,  // Use HTTP for local testing
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
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],  // point to your route files for annotations
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Endpoint to serve raw Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
