export class CrearPedidoErrorFaltaStock extends Error { 
    constructor(){
        super("No hay suficiente stock para crear el pedido");
    }
}

export class CrearPedidoError extends Error {
    constructor(msj){
        super("Error al crear el pedido. Motivo: " + msj);
    }
}

export class ListarPedidosUsuarioError extends Error {
    constructor(){
        super("Error al listar pedidos del usuario");
    }
}

export class PedidoNoEncontradoError extends Error {
    constructor(msj) {
        super("Pedido no encontrado. Motivo: " + msj);
    }
}

export class EstadoPedidoInvalidoError extends Error {
    constructor() {
        super("El estado del pedido no es válido");
    }
}

export class CancelarPedidoError extends Error {
    constructor(msj){
        super("Error al cancelar el pedido. Motivo:: " + msj);
    }
}

export class PedidoNoModificableError extends Error {
    constructor() {
        super("No se pueden cancelar pedidos enviados o entregados");
    }
}

export class ModificarPedidoError extends Error {
    constructor(msj) {
        super("Error al modificar el pedido. Motivo: " + msj);
    }
}

export class ErrorGuardarPedido extends Error {
    constructor(msj) {
        super("Error al guardar el pedido. Motivo: " + msj);
    }
}
