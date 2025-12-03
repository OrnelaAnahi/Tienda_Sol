import { Producto } from "./Producto.js";
import { FactoryNotificacion } from "./Notificacion.js";
import { EstadoPedidoEnum } from "./Enums.js";
import NotificacionesRepository from "../repositories/NotificacionesRepository.js";
import { z } from "zod";

const ItemPedidoSchema = z.object({
  _id: z.string().optional(),
  producto: z.any(),
  cantidad: z.number().min(1),
  precioUnitario: z.number().min(0),
});

export class ItemPedido {
  constructor(payload) {
    const parsed = ItemPedidoSchema.parse(payload);
    this._id = parsed._id;
    this.producto = parsed.producto instanceof Producto
      ? parsed.producto
      : new Producto(parsed.producto);
    this.cantidad = parsed.cantidad;
    this.precioUnitario = parsed.precioUnitario;
  }

  subtotal() {
    return this.cantidad * this.precioUnitario;
  }

  tieneStock() {
    return this.producto.stock >= this.cantidad;
  }

  obtenerVendedor() {
    return this.producto.obtenerVendedor();
  }

  notificarCancelacion() {
    const notificacion = FactoryNotificacion.crearSegunEstadoPedido(
      this.obtenerVendedor(),
      EstadoPedidoEnum.enum.CANCELADO
    );
    NotificacionesRepository.guardar(notificacion);
  }

  modificarCantidad(nuevaCantidad){
    this.cantidad = nuevaCantidad;
  }

  obtenerProductoId(){
    return this.producto._id;
  }
}
