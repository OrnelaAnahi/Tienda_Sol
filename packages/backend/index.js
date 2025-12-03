import "dotenv/config";
import express from "express";
import { startServer } from "./server.js";
import { connectToDB } from "./db.js";
import { buildAppContext } from "./appContext.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

export const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;
if (!DB_URI) {
  console.error(
    "❌ ERROR: MONGO_URI no está definida en las variables de entorno"
  );
  process.exit(1);
}
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const DB_CLIENT = await connectToDB(DB_URI);

const appContext = buildAppContext(DB_CLIENT);

startServer(app, PORT, appContext,host);
