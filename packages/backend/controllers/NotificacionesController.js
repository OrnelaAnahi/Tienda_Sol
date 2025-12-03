import {
    ObtenerNotificacionLeidaError,
    ObtenerNotificacionNoLeidaError,
    NotificacionNoEncontradaError,
    MarcarNotificacionLeidaError,
    ObtenerTodasLasNotificacionesError
} from "../excepciones/notificacion.js";

export class NotificacionesController {
    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    async obtenerTodasLasNotificaciones(req, res) {
        try {
            const notificaciones = await this.notificacionRepository.obtenerTodas();
            return res.status(200).json(notificaciones);
        } catch (error) {
            return res.status(500).json(ObtenerTodasLasNotificacionesError(error.mensaje));
        }
    }

    async obtenerNotificaciones(req, res) {
        const usuarioId = req.params.usuarioId;
        const leidasParam = req.query.leida ?? req.body.leida;
        const leidas = leidasParam === "true" || leidasParam === true;

        try {
            const notificaciones = await this.notificacionRepository.obtenerNotificacionesPorLeidas(
                usuarioId,
                leidas
            );
            return res.status(200).json(notificaciones);
        } catch (error) {
            const errorClass = leidas
                ? new ObtenerNotificacionLeidaError(error.message)
                : new ObtenerNotificacionNoLeidaError(error.message);
            return res.status(500).json(errorClass);
        }
    }

    async marcarNotificacionComoLeida(req, res) {
        const { usuarioId, notificacionId } = req.params;
        try {
            const notificacion = await this.notificacionRepository.buscarPorId(notificacionId);
            if (!notificacion) {
                return res.status(404).json(new NotificacionNoEncontradaError());
            }
            notificacion.marcarComoLeida();
            const notificacionActualizada = await this.notificacionRepository.actualizar(notificacion);

            res.status(200).json({
                mensaje: "Notificación marcada como leída correctamente",
                notificacion: notificacionActualizada
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                new MarcarNotificacionLeidaError(error.message)
            );
        }

    }
}