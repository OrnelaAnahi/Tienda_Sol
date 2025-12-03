import express from "express";
import cors from "cors";
import { configureRoutes } from "./router.js";

export const startServer = (app, port, appContext, host = 'localhost') => {
    const allowedOrigins = process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
        : ['http://localhost:3000']; 
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            
            if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
                return callback(null, true);
            }
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            
            if (process.env.NODE_ENV === 'production' && origin.endsWith('.netlify.app')) {
                return callback(null, true);
            }
            
            callback(new Error('No permitido por CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json());

    app.get("/healthz", (req, res) => {
        res.status(200).send('OK');
    });
    
    app.get("/health", (req, res) => {
        res.status(200).json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    });

    configureRoutes(app, appContext);

    app.use((req, res) => {
        res.status(404).json({ 
            success: false, 
            error: 'Ruta no encontrada' 
        });
    });

    app.use((error, req, res, next) => {
        console.error('❌ Error no manejado:', error);
        res.status(500).json({ 
            success: false, 
            error: process.env.NODE_ENV === 'production' 
                ? 'Error interno del servidor' 
                : error.message 
        });
    });

    app.listen(port, host, () => {
        console.log(`✅ Servidor corriendo en http://${host}:${port}`);
        console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔒 CORS configurado para: ${allowedOrigins.join(', ')}`);
        console.log(`🏥 Health check disponible en /health`);
    });

    return app;
};