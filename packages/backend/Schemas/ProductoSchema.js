import mongoose from "mongoose";

const ProductoSchema = new mongoose.Schema(
  {
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    categoria: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: [0, "El stock no puede ser negativo"],
    },
    precio: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
    },
    moneda: {
      type: String,
      required: true,
      enum: ["PESO_ARS", "DOLAR_USA", "REAL"],
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fotos: [
      {
        type: String,
      },
    ],
    cantidadVendida: {
      type: Number,
      default: 0,
      min: [0, "La cantidad vendida no puede ser negativa"],
    },
  },
  { timestamps: true ,
    versionKey: "__v",   
   optimisticConcurrency: true }
);

export const ProductoModel = mongoose.model("Producto", ProductoSchema);
