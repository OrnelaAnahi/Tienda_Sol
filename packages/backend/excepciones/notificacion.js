export class NotificacionNoEncontradaError extends Error {
    constructor() {
        super("Notificacion no encontrada");
    }
}

export class NotificacionMarcadaComoLeida extends Error {
    constructor() {
        super("Notificacion marcada como leida");
    }
}

export class MarcarNotificacionLeidaError extends Error {
    constructor(msj) {
        super("Error al marcar la notificacion como leida:" + msj);
    }
}

export class ObtenerNotificacionLeidaError extends Error {
    constructor(msj) {
        super("Error al obtener las notificaciones Leidas:" + msj);
    }
}

export class ObtenerNotificacionNoLeidaError extends Error {
    constructor(msj) {
        super("Error al obtener las notificaciones No Leidas:" + msj);
    }
}

export class ObtenerTodasLasNotificacionesError extends Error {
    constructor(msj) {
        super("Error al obtener las notificaciones. Motivo:" + msj);
    }
}

export class ObtenerNotificacionPorIdError extends Error {
    constructor(msj){
        super("Error al buscar la notificación por ID. Motivo: " + msj)
    }
}

export class ErrorActualizarNotificacion extends Error{
    constructor(){
        super("Notificacion debe tener un _id para ser actualizada")
    }
}

