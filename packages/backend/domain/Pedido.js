import { z } from "zod";
import { EstadoPedidoEnum, MonedaSchema } from "./Enums.js";
import { CambioEstadoPedido } from "./CambioEstadoPedido.js";
import { FactoryNotificacion } from "./Notificacion.js";
import NotificacionesRepository from "../repositories/NotificacionesRepository.js";
import { EstadoPedidoInvalidoError } from "../excepciones/pedido.js";
import { DireccionEntrega } from "./DireccionEntrega.js";

const PedidoSchema = z.object({
  _id: z.string().optional(),
  comprador: z.any(),
  items: z.array(z.any()),
  moneda: MonedaSchema,
  direccionEntrega: z.any(),
});
export class Pedido {
  constructor(payload) {
    const parsed = PedidoSchema.parse(payload);
    this._id = parsed._id;
    this.comprador = parsed.comprador;
    this.items = parsed.items;
    this.moneda = parsed.moneda;
    this.direccionEntrega =
      parsed.direccionEntrega instanceof DireccionEntrega
        ? parsed.direccionEntrega
        : new DireccionEntrega(parsed.direccionEntrega);
    this.estado = EstadoPedidoEnum.enum.PENDIENTE;
    this.fechaCreacion = new Date();
    this.historialEstados = [];
    this._notificarVendedoresPorNuevoPedido();

  } // TOTAL LO SACAMOS; TIENE MAS SENTIDO COMO METODO

  _notificarVendedoresPorNuevoPedido() {
    const notificaciones = FactoryNotificacion.crearSegunPedido(this);
    notificaciones.forEach((notificacion) => {
      NotificacionesRepository.guardar(notificacion);
    });
  }

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + item.subtotal(), 0);
  }

  actualizarEstado(nuevoEstado, motivo) {
    if (!Object.values(EstadoPedidoEnum.enum).includes(nuevoEstado)) {
      throw new EstadoPedidoInvalidoError();
    }
    this.estado = nuevoEstado;

    const cambioDeEstado = new CambioEstadoPedido({
      estado: nuevoEstado,
      motivo: motivo,
    });
    this.historialEstados.push(cambioDeEstado);

    if (nuevoEstado === EstadoPedidoEnum.enum.CANCELADO) {
      this.items.forEach((item) => {
        item.notificarCancelacion();
      });
    }
    FactoryNotificacion.crearSegunEstadoPedido(this.comprador, nuevoEstado);
  }

  modificarCantidadItem(itemId, nuevaCantidad, producto) {
    const item = this.buscarItemPorId(itemId);
    if (!item)
      throw new ModificarPedidoError("Item no encontrado en el pedido");
    if (nuevaCantidad <= 0) throw new ModificarPedidoError("Cantidad inválida");
    if (!this.esModificable()) {
      throw new PedidoNoModificableError(
        "No se puede modificar un pedido enviado o entregado"
      );
    }
    const diferencia = nuevaCantidad - item.cantidad;
    if (diferencia > 0) {
      producto.reducirStock(diferencia);
    }
    if (diferencia < 0) {
      producto.aumentarStock(-diferencia);
    }
    item.modificarCantidad(nuevaCantidad);
  }

  validarStock() {
    return this.items.every((item) => item.tieneStock());
  }
  obtenerNombreComprador() {
    return this.comprador.nombre;
  }

  obtenerDireccionEntrega() {
    return this.direccionEntrega.direccionEntrega();
  }

  obtenerIdComprador() {
    return this.comprador.obtenerId();
  }

  buscarItemPorId(itemId) {
    return this.items.find((i) => i._id === itemId);
  }

  obtenerProductoIdDeItem(itemId) {
    const item = this.buscarItemPorId(itemId);
    return item ? item.obtenerProductoId() : null;
  }

  esModificable() {
    return (
      this.estado !== EstadoPedidoEnum.enum.ENVIADO &&
      this.estado !== EstadoPedidoEnum.enum.ENTREGADO
    );
  }
}
