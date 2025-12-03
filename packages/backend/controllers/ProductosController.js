import { Moneda } from "../domain/Enums.js";
import { Producto } from "../domain/Producto.js";
import {
  FiltrosInvalidosError,
  OrdenamientoInvalidoError,
  PaginacionInvalidaError,
  RangoPrecioInvalidoError,
  VendedorInvalidoError,
  VendedorNoExisteError,
} from "../excepciones/producto.js";

export class ProductosController {
  constructor(repo, usuariosRepository) {
    this.repo = repo;
    this.usuariosRepository = usuariosRepository;
  }

  _deProductoRest(datosRest) {
    return {
      ...datosRest,
      vendedor: datosRest.vendedor._id,
    };
  }

  _aProductoRest(producto) {
    return {
      id: producto._id,
      titulo: producto.titulo,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      stock: producto.stock,
      precio: producto.precio,
      fotos: producto.fotos,
      fechaCreacion: producto.createdAt,
      vendedor: {
        nombre: producto.vendedor.nombre,
        email: producto.vendedor.email,
        telefono: producto.vendedor.telefono,
      },
    };
  }

  async crearProducto(req, res) {
    try {
      const datosProducto = this._deProductoRest(req.body);
      const producto = new Producto(datosProducto);
      const productoGuardado = await this.repo.save(producto);
      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: productoGuardado,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerTodosLosProductos(req, res) {
    try {
      const queryParams = req.query;

      this._validarParametrosGenerales(queryParams);

      const filtros = this._construirFiltrosGenerales(queryParams);
      const paginacion = this._extraerPaginacion(queryParams);
      const ordenamiento = this._extraerOrdenamiento(queryParams);

      const productos = await this.repo.findByFiltros(
        filtros,
        paginacion,
        ordenamiento
      );

      const total = await this.repo.countByFiltros(filtros);

      const productosLimpios = productos.map((producto) =>
        this._aProductoRest(producto)
      );

      res.status(200).json({
        data: productosLimpios,
        pagination: this._construirRespuestaPaginacion(paginacion, total),
        filters: this._construirRespuestaFiltrosGenerales(queryParams),
      });
    } catch (error) {
      if (
        error instanceof FiltrosInvalidosError ||
        error instanceof RangoPrecioInvalidoError ||
        error instanceof PaginacionInvalidaError ||
        error instanceof OrdenamientoInvalidoError
      ) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async obtenerProductosPorVendedor(req, res) {
    try {
      const { idVendedor } = req.params;
      const queryParams = req.query;

      this._validarParametros(queryParams, idVendedor);

      const filtros = this._construirFiltros(idVendedor, queryParams);
      const paginacion = this._extraerPaginacion(queryParams);
      const ordenamiento = this._extraerOrdenamiento(queryParams);

      const vendedorExiste = await this.usuariosRepository.existeVendedor(
        filtros.vendedor
      );
      if (!vendedorExiste) {
        throw new VendedorNoExisteError(filtros.vendedor);
      }

      const productos = await this.repo.findByVendedor(
        filtros,
        paginacion,
        ordenamiento
      );

      const total = await this.repo.countByVendedor(filtros);

      const productosLimpios = productos.map((producto) =>
        this._aProductoRest(producto)
      );

      res.status(200).json({
        success: true,
        data: productosLimpios,
        pagination: this._construirRespuestaPaginacion(paginacion, total),
        filters: this._construirRespuestaFiltros(idVendedor, queryParams),
      });
    } catch (error) {
      if (error instanceof VendedorNoExisteError) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (
        error instanceof FiltrosInvalidosError ||
        error instanceof RangoPrecioInvalidoError ||
        error instanceof PaginacionInvalidaError ||
        error instanceof OrdenamientoInvalidoError ||
        error instanceof VendedorInvalidoError
      ) {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  _validarParametros({ min, max, page, size, sort }, idVendedor) {
    if (!idVendedor || !/^[0-9a-fA-F]{24}$/.test(idVendedor)) {
      throw new VendedorInvalidoError(idVendedor);
    }

    if (min && max && parseFloat(min) > parseFloat(max)) {
      throw new RangoPrecioInvalidoError();
    }

    if (page && (isNaN(page) || parseInt(page) < 1)) {
      throw new PaginacionInvalidaError("page debe ser un número mayor a 0");
    }
    if (size && (isNaN(size) || parseInt(size) < 1 || parseInt(size) > 100)) {
      throw new PaginacionInvalidaError(
        "size debe ser un número entre 1 y 100"
      );
    }

    if (sort && !["price_asc", "price_desc", "most_sold", "createdAt"].includes(sort)) {
      throw new OrdenamientoInvalidoError(sort);
    }
  }

  _construirFiltros(idVendedor, queryParams) {
    const filtros = { vendedor: idVendedor };

    const rangoPrecio = this._obtenerRangoPrecio(queryParams);
    if (rangoPrecio) {
      filtros.precio = rangoPrecio;
    }
    const busquedaTexto = this._obtenerBusquedaTexto(queryParams);
    if (busquedaTexto.length > 0) {
      filtros.$or = busquedaTexto;
    }
    return filtros;
  }

  _obtenerRangoPrecio({ min, max }) {
    if (!min && !max) return null;
    const rango = {};
    if (min) rango.$gte = parseFloat(min);
    if (max) rango.$lte = parseFloat(max);
    return rango;
  }

  _obtenerBusquedaTexto({ nombre, categoria, descripcion }) {
    const terminos = [];

    if (nombre) terminos.push({ titulo: { $regex: nombre, $options: "i" } });
    if (categoria)
      terminos.push({ categoria: { $regex: categoria, $options: "i" } });
    if (descripcion)
      terminos.push({ descripcion: { $regex: descripcion, $options: "i" } });

    return terminos;
  }

  _extraerPaginacion({ page = 1, size = 10 }) {
    const pagina = Math.max(1, parseInt(page));
    const tamanio = Math.min(50, Math.max(1, parseInt(size)));
    return {
      pag: pagina,
      tam: tamanio,
      saltear: (pagina - 1) * tamanio,
    };
  }

  _extraerOrdenamiento({ sort = "price_asc" }) {
    const ordenamientos = {
      price_asc: { precio: 1 },
      price_desc: { precio: -1 },
      most_sold: { cantidadVendida: -1 },
      createdAt: { createdAt: -1 },
    };
    return ordenamientos[sort] || ordenamientos["price_asc"];
  }

  _construirRespuestaPaginacion({ pag, tam }, total) {
    const totalPages = Math.ceil(total / tam);
    return {
      currentPage: pag,
      pageSize: tam,
      totalItems: total,
      totalPages,
      hasNextPage: pag < totalPages,
      hasPrevPage: pag > 1,
    };
  }

  _construirRespuestaFiltros(
    idVendedor,
    { min, max, nombre, categoria, descripcion, sort }
  ) {
    return {
      vendedor: idVendedor,
      rangoPrecios: { min, max },
      busqueda: { nombre, categoria, descripcion },
      ordenamiento: sort || "price_asc",
    };
  }

  _validarParametrosGenerales({ min, max, page, size, sort }) {
    if (min && max && parseFloat(min) > parseFloat(max)) {
      throw new RangoPrecioInvalidoError();
    }

    if (page && (isNaN(page) || parseInt(page) < 1)) {
      throw new PaginacionInvalidaError("page debe ser un número mayor a 0");
    }
    if (size && (isNaN(size) || parseInt(size) < 1 || parseInt(size) > 100)) {
      throw new PaginacionInvalidaError(
        "size debe ser un número entre 1 y 100"
      );
    }

    if (sort && !["price_asc", "price_desc", "most_sold", "createdAt"].includes(sort)) {
      throw new OrdenamientoInvalidoError(sort);
    }
  }

  _construirFiltrosGenerales(queryParams) {
    const filtros = {};

    const rangoPrecio = this._obtenerRangoPrecio(queryParams);
    if (rangoPrecio) {
      filtros.precio = rangoPrecio;
    }
    const busquedaTexto = this._obtenerBusquedaTexto(queryParams);
    if (busquedaTexto.length > 0) {
      filtros.$or = busquedaTexto;
    }
    return filtros;
  }

  _construirRespuestaFiltrosGenerales({
    min,
    max,
    nombre,
    categoria,
    descripcion,
    sort,
  }) {
    return {
      rangoPrecios: { min, max },
      busqueda: { nombre, categoria, descripcion },
      ordenamiento: sort || "price_asc",
    };
  }

  async obtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await this.repo.buscarPorId(id);
      if (!producto) {  
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }
      const productoLimpio = this._aProductoRest(producto);
      res.status(200).json({
        success: true,
        data: productoLimpio,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
