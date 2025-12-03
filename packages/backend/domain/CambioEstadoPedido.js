import {z} from "zod";
import { EstadoPedidoEnumSchema } from "./Enums.js";

const CambioEstadoPedidoSchema = z.object({
    estado: EstadoPedidoEnumSchema,
    motivo: z.string(),
});

export class CambioEstadoPedido {
    constructor(payload){
        const parsed = CambioEstadoPedidoSchema.parse(payload);
        this.fecha = new Date();
        this.estado = parsed.estado;
        this.motivo = parsed.motivo;
    }
}