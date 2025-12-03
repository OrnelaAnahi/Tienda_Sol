import { PedidoModel } from "../Schemas/PedidoSchema.js";
import { Pedido } from "../domain/Pedido.js";
import { ItemPedido } from "../domain/ItemPedido.js";
import { Producto } from "../domain/Producto.js"; 
import { Usuario } from "../domain/Usuario.js"; 
import { DireccionEntrega } from "../domain/DireccionEntrega.js"; 
import { EstadoPedidoEnum } from "../domain/Enums.js";

export class PedidosRepository {
  constructor() {
    this.model = PedidoModel;
  }

  aPedidoDB(pedido) {
    return {
      comprador: pedido.obtenerIdComprador(), 
      items: pedido.items.map(i => ({
        producto: i.producto._id || i.producto.id,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario,
      })),
      moneda: pedido.moneda,
      estado: pedido.estado?.toString() ?? "PENDIENTE",
      direccionEntrega: {
        calle: pedido.direccionEntrega.calle,
        altura: pedido.direccionEntrega.altura,
        piso: pedido.direccionEntrega.piso,
        departamento: pedido.direccionEntrega.departamento,
        codigoPostal: pedido.direccionEntrega.codigoPostal,
        ciudad: pedido.direccionEntrega.ciudad,
        provincia: pedido.direccionEntrega.provincia,
        pais: pedido.direccionEntrega.pais,
        lat: pedido.direccionEntrega.lat,
        lon: pedido.direccionEntrega.lon,
      },
      total: pedido.calcularTotal(),
      fechaCreacion: pedido.fechaCreacion ?? new Date(),
      historialEstados: pedido.historialEstados ?? [],
    };
  }

  aItemDB(item) {
    return {
      producto: item.producto._id || item.producto.id,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
    };
  }

  async dePedidoDB(doc) {
    if (!doc) return null;

    const comprador = new Usuario({
      id: doc.comprador._id || doc.comprador.id,
      nombre: doc.comprador.nombre,
      email: doc.comprador.email,
      telefono: doc.comprador.telefono,
    });
    const items = doc.items.map(i => new ItemPedido({
      producto: new Producto(i.producto),
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
      _id: i._id.toString()
    })
  );
    const direccionEntrega = new DireccionEntrega(doc.direccionEntrega);
    const pedido = new Pedido({
      comprador,
      items,
      moneda: doc.moneda,
      direccionEntrega,
    });
    pedido._id = doc._id.toString();
    pedido.estado = EstadoPedidoEnum.enum[doc.estado];
    pedido.fechaCreacion = doc.fechaCreacion;
    pedido.historialEstados = doc.historialEstados ?? [];
    return pedido;
  }

  async guardar(pedido) {
  const pedidoDB = this.aPedidoDB(pedido);
  const pedidoGuardado = await this.model.create(pedidoDB);
  
  const populated = await this.model
    .findById(pedidoGuardado._id)
    .populate("comprador")
    .populate("items.producto");
  
  return await this.dePedidoDB(populated);
}

  async buscarPorId(id) {
    try {
      const doc = await this.model
        .findById(id)
        .populate("comprador")
        .populate("items.producto");
      return await this.dePedidoDB(doc);
    } catch (error) {
      throw new Error("Error al buscar pedido: " + error.message);
    }
  }

  async listarPorUsuario(idUsuario) {
    try {
      const docs = await this.model
        .find({ comprador: idUsuario })
        .populate("comprador")
        .populate("items.producto");
      return Promise.all(docs.map(doc => this.dePedidoDB(doc)));
    } catch (error) {
      throw new Error("Error al listar pedidos por usuario: " + error.message);
    }
  }

  async actualizar(pedido) {
    try {
      const doc = await this.model.findById(pedido._id);
      if (!doc) throw new Error("Pedido no encontrado");

      doc.estado = pedido.estado.toString();
      doc.historialEstados = pedido.historialEstados;
      doc.items = pedido.items.map(i => this.aItemDB(i));
      doc.updatedAt = new Date();

      const saved = await doc.save();
      const populated = await this.model
        .findById(saved._id)
        .populate("comprador")
        .populate("items.producto");

      return await this.dePedidoDB(populated);
    } catch (error) {
      throw new Error("Error al actualizar pedido: " + error.message);
    }
  }

  async cancelarPedido(idPedido) {
    try {
      const updated = await this.model
        .findByIdAndUpdate(
          idPedido,
          { estado: "CANCELADO" },
          { new: true }
        )
        .populate("comprador")
        .populate("items.producto");

      return await this.dePedidoDB(updated);
    } catch (error) {
      //(updated);
      throw new Error("Error al cancelar pedido: " + error.message);
    }
  }
}

export default new PedidosRepository();