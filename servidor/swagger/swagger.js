const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'Documentación de mi API usando Swagger con autenticación',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], // Habilita autenticación en todas las rutas
  },
  apis: ['./routes/*.js'], // Asegura que Swagger escanee todos los archivos de rutas
};


const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api/documentacion', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token después de autenticar en Swagger UI
    },
  }));
};
