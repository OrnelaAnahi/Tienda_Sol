import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["COMPRADOR", "VENDEDOR", "ADMIN"],
      default: "COMPRADOR",
    },
    fechaAlta: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);
