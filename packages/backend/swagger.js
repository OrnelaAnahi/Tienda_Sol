import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API TiendaSol - Documentación de Endpoints",
    version: "1.0.0",
    description:
      "Documentación del endpoint seleccionado para el Trabajo Práctico DDS",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,   
  apis: [path.join(__dirname, "../docs/pedidos.yaml")]
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };