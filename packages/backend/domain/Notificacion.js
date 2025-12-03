import { z } from "zod";
import { EstadoPedidoEnum } from "./Enums.js";

const NotificacionSchema = z.object({
  _id: z.any().optional(),              
  usuarioDestino: z.any(),               
  mensaje: z.string().min(1),
  fechaAlta: z.date().optional(),
  leida: z.boolean().optional(),
  fechaLeida: z.date().nullable().optional(),
});

export class Notificacion {
  constructor(payload) {
    const parsed = NotificacionSchema.parse(payload);

    this._id = parsed._id ?? null;
    this.usuarioDestino = parsed.usuarioDestino;
    this.mensaje = parsed.mensaje;

    this.fechaAlta = parsed.fechaAlta ?? new Date();
    this.leida = parsed.leida ?? false;
    this.fechaLeida = parsed.fechaLeida ?? null;
  }
  marcarComoLeida() {
    this.leida = true;
    this.fechaLeida = new Date();
  }

  isLeida() {
    return this.leida;
  }
}

//SOLO DEBE CREAR NOTIFICACIONES
//NO DEBE TENER LA RESPONSABILIDAD DE GUARDARLAS
export class FactoryNotificacion {

  static crearSegunEstadoPedido(usuario, estado) {
    const mensaje = EstadoPedidoEnum.mensajes[estado];
    return this.crearNotificacion(usuario, mensaje);
  }

  static crearSegunPedido(pedido) {
    const grupos = this._agruparItemsPorVendedor(pedido.items);
    return grupos.map(grupo => this._crearNotificacionParaGrupo(grupo, pedido));
  }

  static _agruparItemsPorVendedor(items) {
    const grupoMap = new Map();

    items.forEach(item => {
      const vendedor = item.obtenerVendedor();
      if (!grupoMap.has(vendedor)) {
        grupoMap.set(vendedor, { vendedor, items: [] });
      }
      grupoMap.get(vendedor).items.push(item);
    });

    return Array.from(grupoMap.values());
  }

  static _crearNotificacionParaGrupo({ vendedor, items }, pedido) {
    const total = this._calcularTotal(items);
    const productos = this._formatearProductos(items);
    const mensaje = this._construirMensaje(pedido, productos, total);
    return this.crearNotificacion(vendedor, mensaje);
  }

  static _calcularTotal(items) {
    return items.reduce((sum, i) => sum + i.subtotal(), 0);
  }

  static _formatearProductos(items) {
    return items.map(i => `${i.producto.titulo ?? i.producto.nombre} x${i.cantidad}`).join(", ");
  }

  static _construirMensaje(pedido, productos, total) {
    return [
      `Nuevo pedido de ${pedido.obtenerNombreComprador()}: ${productos}.`,
      `Total: ${total} ${pedido.moneda.signo ?? pedido.moneda}.`,
      `Entregar en: ${pedido.obtenerDireccionEntrega()}.`
    ].join(" ");
  }

  static crearNotificacion(usuario, mensaje) {
    return new Notificacion({ usuarioDestino: usuario, mensaje });
  }
}
