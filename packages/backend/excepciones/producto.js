export class CantidadNegativaError extends Error {
    constructor() {
        super("La cantidad solicitada debe ser positiva");
    }
}

export class StockInsuficienteError extends Error {
    constructor() {
        super("No hay suficiente stock para la cantidad solicitada");
    }
}

export class ProductoInvalidoError extends Error{
    constructor(mensaje) {
        super(`El producto no esta disponible: ${mensaje}`)
    }
}

export class VendedorNoExisteError extends Error {
    constructor(idVendedor) {
        super(`El vendedor con ID ${idVendedor} no existe`);
    }
}

export class FiltrosInvalidosError extends Error {
    constructor(detalle) {
        super(`Los filtros aplicados son inválidos: ${detalle}`);
    }
}

export class RangoPrecioInvalidoError extends Error {
    constructor() {
        super("El rango de precios es inválido: el precio mínimo debe ser menor al máximo");
    }
}

export class PaginacionInvalidaError extends Error {
    constructor(detalle) {
        super(`Los parámetros de paginación son inválidos: ${detalle}`);
    }
}

export class OrdenamientoInvalidoError extends Error {
    constructor(sort) {
        super(`El criterio de ordenamiento '${sort}' no es válido. Valores permitidos: price_asc, price_desc, most_sold, createdAt`);
    }
}

export class ParametrosBusquedaInvalidosError extends Error {
    constructor(detalle) {
        super(`Los parámetros de búsqueda son inválidos: ${detalle}`);
    }
}

export class VendedorInvalidoError extends Error {
    constructor(id) {
        super(`El ID de vendedor '${id}' tiene un formato inválido`);
    }
}