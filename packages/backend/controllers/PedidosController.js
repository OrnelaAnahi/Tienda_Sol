import { CrearPedidoDTO } from "../dtos/input/pedidosInputDTO.js";
import { Pedido } from "../domain/Pedido.js";
import { ItemPedido } from "../domain/ItemPedido.js";
import { Usuario } from "../domain/Usuario.js";
import {
  CrearPedidoError,
  CrearPedidoErrorFaltaStock,
  PedidoNoEncontradoError,
  ModificarPedidoError,
  PedidoNoModificableError,
  ListarPedidosUsuarioError,
  CancelarPedidoError,
} from "../excepciones/pedido.js";
import {
  StockInsuficienteError,
  CantidadNegativaError,
  ProductoInvalidoError,
} from "../excepciones/producto.js";
import { EstadoPedidoEnum } from "../domain/Enums.js";

export class PedidosController {
  constructor(pedidosRepository, productosRepository, usuarioRepository) {
    this.pedidosRepository = pedidosRepository;
    this.productosRepository = productosRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async crearPedido(req, res) {
    const body = req.body;
    try {
      const dto = CrearPedidoDTO.parse(body);
      const items = await this._crearItemsPedido(dto.items);
      const compradorDoc = await this.usuarioRepository.findById(
        dto.compradorId
      );
      //if (!pedido.validarStock()) {
      //  throw new CrearPedidoErrorFaltaStock("No hay stock suficiente");
      //}
      if (!compradorDoc) throw new CrearPedidoError("Comprador no encontrado");
      const comprador = new Usuario(compradorDoc);
      const pedido = new Pedido({
        comprador,
        items,
        moneda: dto.moneda,
        direccionEntrega: dto.direccionEntrega,
      });
      const pedidoGuardado = await this.pedidosRepository.guardar(pedido);
      //pedido._notificarVendedoresPorNuevoPedido();
      return res.status(201).json(pedidoGuardado);
    } catch (error) {
      if (
        error instanceof CrearPedidoError ||
        error instanceof CrearPedidoErrorFaltaStock ||
        error instanceof ProductoInvalidoError ||
        error instanceof CantidadNegativaError
      ) {
        return res.status(400).json({ success: false, error: error.message });
      } else {
        return res.status(500).json({ success: false, error: error.message });
      }
    }
  }

  async _crearItemsPedido(itemsDto) {
  return Promise.all(
    itemsDto.map(async (itemDto) => {
      const MAX_REINTENTOS = 3;
      let intentos = 0;

      while (intentos < MAX_REINTENTOS) {
        try {
          const producto = await this.productosRepository.buscarPorId(
            itemDto.productoId
          );

          if (!producto) {
            throw new CrearPedidoError(
              `Producto no encontrado: ${itemDto.productoId}`
            );
          }

          // Repositorio maneja reducción y actualización 
          await this.productosRepository.reservarStock(producto, itemDto.cantidad);

          return new ItemPedido({
            producto,
            cantidad: itemDto.cantidad,
            precioUnitario: itemDto.precioUnitario,
          });
        } catch (error) {
          if (error.message.includes("Conflicto de concurrencia")) {
            intentos++;
            if (intentos >= MAX_REINTENTOS) {
              throw new CrearPedidoError(
                `No se pudo reservar stock para el producto ${itemDto.productoId} después de ${MAX_REINTENTOS} intentos`
              );
            }
            await new Promise((resolve) =>
              setTimeout(resolve, 100 * intentos)
            );
            continue;
          }

          if (error instanceof StockInsuficienteError) {
            throw new CrearPedidoErrorFaltaStock(
              `Stock insuficiente para el producto ${itemDto.productoId}`
            );
          }
          throw error;
        }
      }
    })
  );
}

  async verPedidos(req, res) {
    const usuario = req.query.usuarioId;
    try {
      const pedidos = await this.pedidosRepository.listarPorUsuario(usuario);
      return res.status(200).json(pedidos);
    } catch (error) {
      if (
        error instanceof PedidoNoEncontradoError ||
        error instanceof ListarPedidosUsuarioError
      ) {
        return res.status(404).json({ status: false, error: error.message });
      } else {
        return res.status(500).json({ status: false, error: error.message });
      }
    }
  }  

  async cancelarPedido(req, res) {
    const { id } = req.params;
    const motivo = req.body.motivo;
    try {
      const pedidoCancelado = await this.pedidosRepository.buscarPorId(id);
      if (!pedidoCancelado) throw new PedidoNoEncontradoError(id);
      if (!pedidoCancelado.esModificable())
        throw new PedidoNoModificableError(
          "No se puede cancelar un pedido enviado o entregado"
        );

      pedidoCancelado.actualizarEstado(EstadoPedidoEnum.enum.CANCELADO, motivo);
      await this.pedidosRepository.actualizar(pedidoCancelado);
      return res.status(200).json(pedidoCancelado);
    } catch (error) {
      if (error instanceof PedidoNoEncontradoError) {
        return res.status(404).json({ status: false, error: error.message });
      }
      if (
        error instanceof PedidoNoModificableError ||
        error instanceof ModificarPedidoError ||
        error instanceof CancelarPedidoError
      ) {
        return res.status(405).json({ status: false, error: error.message });
      }
      return res.status(500).json({ status: false, error: error.message });
    }
  }

  async modificarItemPedido(req, res) {
    const { pedidoId, itemId } = req.params;
    const { nuevaCantidad } = req.body;
    try {
      const pedido = await this.pedidosRepository.buscarPorId(pedidoId);
      if (!pedido) throw new PedidoNoEncontradoError(pedidoId);

      const productoId = pedido.obtenerProductoIdDeItem(itemId);
      if (!productoId)
        throw new ModificarPedidoError("Item no encontrado en el pedido");

      const producto = await this.productosRepository.buscarPorId(productoId);
      pedido.modificarCantidadItem(itemId, nuevaCantidad, producto);

      await this.productosRepository.actualizar(producto);
      await this.pedidosRepository.actualizar(pedido);
      return res.status(200).json(pedido);
    } catch (error) {
      if (error instanceof ModificarPedidoError) {
        return res.status(400).json({ status: false, error: error.message });
      }
      if (error instanceof PedidoNoEncontradoError) {
        return res.status(404).json({ status: false, error: error.message });
      }
      return res.status(500).json({ status: false, error: error.message });
    }
  }
}
