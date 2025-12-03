import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: { type: Number, required: true, min: 1 },
        precioUnitario: { type: Number, required: true, min: 0 },
      },
    ],
    moneda: { 
        type: String, 
        required: true 
    },
    direccionEntrega: {
      calle: { type: String, required: true },
      altura: { type: String, required: true },
      piso: { type: String },
      departamento: { type: String },
      codigoPostal: { type: String, required: true },
      ciudad: { type: String, required: true },
      provincia: { type: String, required: true },
      pais: { type: String, required: true },
      lat: { type: String },
      lon: { type: String },
    },
    estado: {
      type: String,
      enum: ["PENDIENTE", "EN_PROCESO", "ENVIADO", "ENTREGADO", "CANCELADO"],
      default: "PENDIENTE",
    },
    historialEstados: [
      {
        estado: {
          type: String,
          enum: ["PENDIENTE", "EN_PROCESO", "ENVIADO", "ENTREGADO", "CANCELADO"],
        },
        fechaCambio: { 
            type: Date, 
            default: Date.now 
        },
      },
    ],
    total: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    fechaCreacion: { type: Date, default: Date.now }
  },

  { timestamps: true }
);

export const PedidoModel = mongoose.model("Pedido", PedidoSchema);
