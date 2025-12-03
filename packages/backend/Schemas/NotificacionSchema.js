import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema(
  {
    usuarioDestino: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    mensaje: { type: String, required: true, trim: true },
    fechaAlta: { type: Date, default: Date.now },
    leida: { type: Boolean, default: false },
    fechaLeida: { type: Date, default: null },
  },
  { timestamps: true }
);

export const NotificacionModel = mongoose.model("Notificacion", NotificacionSchema);    