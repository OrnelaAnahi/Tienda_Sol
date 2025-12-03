import mongoose from "mongoose";
import { UsuarioModel } from "./Schemas/UsuarioSchema.js";
import { ProductoModel } from "./Schemas/ProductoSchema.js";

const MONGO_URI = "mongodb://root:example@localhost:27017/Tienda_Sol?authSource=admin"; // cambiá el nombre de la base si querés

await mongoose.connect(MONGO_URI);
console.log("✅ Conectado a MongoDB");

// 1️⃣ Crear vendedores
const vendedor1 = await UsuarioModel.create({
  nombre: "Juan Pérez",
  email: "juan.vendedor@example.com",
  telefono: "1122334455",
  tipo: "VENDEDOR",
});

const vendedor2 = await UsuarioModel.create({
  nombre: "María Gómez",
  email: "maria.vendedora@example.com",
  telefono: "1199887766",
  tipo: "VENDEDOR",
});

// 2️⃣ Crear productos asociados
await ProductoModel.create([
  {
    vendedor: vendedor1._id,
    titulo: "Auriculares Bluetooth",
    descripcion: "Auriculares inalámbricos con cancelación de ruido.",
    categoria: ["Electrónica", "Audio"],
    stock: 20,
    precio: 25000,
    moneda: "PESO_ARS",
    fotos: ["https://example.com/auriculares.jpg"],
  },
  {
    vendedor: vendedor2._id,
    titulo: "Mochila Urbana",
    descripcion: "Mochila resistente al agua con compartimento para laptop.",
    categoria: ["Moda", "Accesorios"],
    stock: 10,
    precio: 18000,
    moneda: "PESO_ARS",
    fotos: ["https://example.com/mochila.jpg"],
  },
]);

console.log("✅ Datos insertados correctamente");
await mongoose.disconnect();
