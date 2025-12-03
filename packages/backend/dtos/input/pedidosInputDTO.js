import { z } from "zod";
import { MonedaSchema } from "../../domain/Enums.js";
import { DireccionEntregaSchema } from "../../domain/DireccionEntrega.js";
export const CrearPedidoItemDTO = z.object({
    productoId: z.string(),
    cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
    precioUnitario: z.number().positive()
});

export const CrearPedidoDTO = z.object({
    compradorId: z.string(),
    items: z.array(CrearPedidoItemDTO).min(1, "Debe haber al menos un ítem"),
    moneda: MonedaSchema,
    direccionEntrega: DireccionEntregaSchema
});
