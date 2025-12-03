import z from "zod";
import { TipoUsuarioEnum } from "./Enums.js";

export const UsuarioSchema = z.object({
    _id: z.any().optional(),      
    id: z.any().optional(),
    nombre: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().min(1).optional(),
});

export class Usuario {
    constructor(payload) {
        const parsed = UsuarioSchema.parse(payload);
        this._id = payload._id || payload.id || null;
        this.nombre = parsed.nombre;
        this.email = parsed.email;
        this.telefono = parsed.telefono || null;
        this.fechaAlta = new Date();
        this.tipo = TipoUsuarioEnum.enum.COMPRADOR;
    }
    obtenerId() {
        return this._id;
    }
}
