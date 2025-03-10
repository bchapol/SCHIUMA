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
          bearerFormat: 'JWT', // Formato del token
        },
      },
    },
    security: [{ bearerAuth: [] }], // Habilita seguridad en todas las rutas
  },
  apis: ['./routes/employees.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = (app) => {
  // Configuración de Swagger UI
  app.use('/api/documentacion', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        // Si el token se encuentra en la cabecera, se agrega automáticamente
        const token = req.headers['authorization'];
        if (token) {
          req.headers['Authorization'] = token;
        }
        return req;
      },
    },
  }));
};
