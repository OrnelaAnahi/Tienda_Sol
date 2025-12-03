import { ProductoModel } from "../Schemas/ProductoSchema.js";
import { Producto } from "../domain/Producto.js";
import { ProductoInvalidoError } from "../excepciones/producto.js";

export class ProductosRepository {
  constructor() {
    this.model = ProductoModel;
  }

  aProductoDB(producto) {
    return {
      vendedor: producto.vendedor,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      categoria: producto.categoria.map((cat) => cat.nombre),
      stock: producto.stock,
      precio: producto.precio,
      moneda: producto.moneda,
      activo: producto.activo,
      fotos: producto.fotos,
      cantidadVendida: producto.cantidadVendida || 0,
    };
  }

  async findAllActive() {
    try {
      const productos = await this.model.find({ activo: true });
      return productos;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async save(producto) {
    try {
      const productoDB = this.aProductoDB(producto);
      const productoGuardado = await this.model.create(productoDB);
      return productoGuardado;
    } catch (error) {
      throw new Error("Error al guardar el producto: " + error.message);
    }
  }

  async findByVendedor(filtros, paginacion, ordenamiento) {
    try {
      const productos = await this.model
        .find({
          ...filtros,
          activo: true,
        })
        .populate("vendedor", "nombre email telefono")
        .sort(ordenamiento)
        .skip(paginacion.saltear)
        .limit(paginacion.tam)
        .lean();
      return productos;
    } catch (error) {
      throw new Error(
        "Error al buscar productos por vendedor: " + error.message
      );
    }
  }

  async countByVendedor(filtros) {
    try {
      const total = await this.model.countDocuments({
        ...filtros,
        activo: true,
      });
      return total;
    } catch (error) {
      throw new Error(
        "Error al contar productos por vendedor: " + error.message
      );
    }
  }

  async buscarPorId(id) {
    try {
      const producto = await this.model
        .findById(id)
        .populate("vendedor")
        .lean();
      if (!producto) return null;
      return this._mapearProductoADominio(producto);
    } catch (error) {
      throw new Error("Error al buscar el producto por ID: " + error.message);
    }
  }
  _mapearProductoADominio(doc) {
    const producto = new Producto({
      _id: doc._id?.toString(),
      vendedor: doc.vendedor,
      titulo: doc.titulo,
      descripcion: doc.descripcion,
      categoria: Array.isArray(doc.categoria)
        ? doc.categoria.map((nombre) => ({ nombre }))
        : [],
      stock: doc.stock,
      precio: doc.precio,
      moneda: doc.moneda,
      activo: doc.activo,
      fotos: doc.fotos ?? [],
      cantidadVendida: doc.cantidadVendida ?? 0,
    });

    // Preservar el __v para control de concurrencia
    producto.__v = doc.__v;

    return producto;
  }

  async actualizar(producto) {
    const datosActualizados = {
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      categoria: producto.categoria.map((cat) => cat.nombre),
      stock: producto.stock,
      precio: producto.precio,
      moneda: producto.moneda,
      activo: producto.activo,
      fotos: producto.fotos,
      cantidadVendida: producto.cantidadVendida,
    };

    const actualizado = await this.model
      .findOneAndUpdate(
        { _id: producto._id, __v: producto.__v }, // Ahora si se realiza el control de concurrencia
        { $set: datosActualizados, $inc: { __v: 1 } },
        { new: true, runValidators: true }
      )
      .populate("vendedor")
      .lean();

    if (!actualizado) {
      // Verificar si es problema de versión o producto inexistente
      const existe = await this.model.findById(producto._id);
      if (!existe) {
        throw new ProductoInvalidoError("El producto no existe");
      }
      throw new Error(
        "Conflicto de concurrencia: el producto fue modificado por otro proceso"
      );
    }
    return this._mapearProductoADominio(actualizado);
  }

  async reservarStock(producto, cantidad) {
    
    producto.reducirStock(cantidad);

    
    const actualizado = await this.actualizar(producto);

    return actualizado;
  }

  async findByFiltros(filtros, paginacion, ordenamiento) {
    const productos = await this.model
      .find({
        ...filtros,
        activo: true,
      })
      .populate("vendedor", "nombre email telefono")
      .sort(ordenamiento)
      .skip(paginacion.saltear)
      .limit(paginacion.tam)
      .lean();
    return productos.map((doc) => this._mapearProductoADominio(doc));
  }

  async countByFiltros(filtros) {
    const total = await this.model.countDocuments({
      ...filtros,
      activo: true,
    });
    return total;
  }
}
