import { z } from "zod";
import { MonedaSchema } from "./Enums.js"; 
import { CategoriaSchema } from "./Categoria.js";
import { CantidadNegativaError, StockInsuficienteError } from "../excepciones/producto.js";

export const ProductoSchema = z.object({
  vendedor: z.any(), 
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().optional(),
  categoria: z
    .array(z.union([z.string(), CategoriaSchema]))
    .transform(arr =>
      arr.map(c => (typeof c === "string" ? { nombre: c } : c))
    ),  
  stock: z.number().nonnegative("El stock no puede ser negativo"),
  precio: z.number().positive("El precio debe ser positivo"), 
  moneda: MonedaSchema, 
  activo: z.boolean().default(true),
  fotos: z.array(z.string()).optional(),
  cantidadVendida: z.number().nonnegative("La cantidad vendida no puede ser negativa").default(0)
});

export class Producto {
  constructor(payload) {
    const parsed = ProductoSchema.parse(payload);
    this._id = payload._id || payload.id || null;
    this.__v = payload.__v;
    this.vendedor = parsed.vendedor;
    this.titulo = parsed.titulo;
    this.descripcion = parsed.descripcion;
    this.categoria = parsed.categoria;
    this.stock = parsed.stock;
    this.precio = parsed.precio; 
    this.moneda = parsed.moneda; 
    this.activo = parsed.activo;
    this.fotos = parsed.fotos ?? [];
    this.cantidadVendida = parsed.cantidadVendida;
  }

  estaDisponible(cantidad) {
    return this.activo && this.stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (cantidad <= 0) throw new CantidadNegativaError();
    if (this.stock < cantidad){
      throw new StockInsuficienteError();
    }
    this.stock -= cantidad;
    
  }
  aumentarStock(cantidad) {
    if (cantidad <= 0) throw new CantidadNegativaError();
    this.stock += cantidad;
  }

  obtenerVendedor() {
    return this.vendedor;
  }
}
