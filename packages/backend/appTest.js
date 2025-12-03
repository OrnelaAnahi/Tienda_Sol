import express from 'express';
import { buildAppContext } from "./utils/appContext.js";
import { configureRoutes } from "./utils/router.js";

export const app = express();
app.use(express.json());

const appContext = buildAppContext(null);

configureRoutes(app, appContext);