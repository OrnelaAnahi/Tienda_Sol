import { connectToDB } from '../db.js';
import { crearDatosPruebaProductos, ejemplosTest } from './datosPruebaProductos.js';

const ejecutarScript = async () => {
    try {
        // Pasar la URI completa desde el .env
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
        await connectToDB(MONGODB_URI);
        
        const resultado = await crearDatosPruebaProductos();
        
        ejemplosTest(resultado.vendedor1);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

ejecutarScript();