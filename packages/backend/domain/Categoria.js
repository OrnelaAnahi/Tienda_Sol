import { z } from "zod";

export const CategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre de la categoría es obligatorio"),
});

export class Categoria {
  constructor(payload) {
    const parsed = CategoriaSchema.parse(payload);

    this.nombre = parsed.nombre;
  }
}
