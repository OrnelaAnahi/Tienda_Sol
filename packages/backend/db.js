import mongoose from "mongoose";

export const connectToDB = async (uri) => {
  try {
    const dbName = process.env.MONGODB_DB_NAME || "TiendaSol";
    await mongoose.connect(uri, { dbName });
    console.log("Conectado a MongoDB");
    console.log("Base de datos actual:", mongoose.connection.db.databaseName);
    return mongoose.connection;
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1); 
    }
    throw error; 
  }
};