import mongoose from "mongoose";
import { NotificacionModel } from "../Schemas/NotificacionSchema.js";
import { Notificacion } from "../domain/Notificacion.js";
import { Usuario } from "../domain/Usuario.js";
import {
  ObtenerNotificacionLeidaError,
  ObtenerNotificacionPorIdError,
  ObtenerTodasLasNotificacionesError
} from "../excepciones/notificacion.js";
class NotificacionesRepository {
  constructor() {
    this.model = NotificacionModel;
  }

  async aNotificacionDB(notificacion) {
    return {
      usuarioDestino: notificacion.usuarioDestino._id || notificacion.usuarioDestino,
      mensaje: notificacion.mensaje,
      fechaAlta: notificacion.fechaAlta,
      leida: notificacion.leida,
      fechaLeida: notificacion.fechaLeida,
    };
  }

  async deNotificacionDB(doc) {

    if (!doc) return null;

    return new Notificacion({
      _id: doc._id,
      usuarioDestino: new Usuario(doc.usuarioDestino),
      mensaje: doc.mensaje,
      fechaAlta: doc.fechaAlta,
      leida: doc.leida,
      fechaLeida: doc.fechaLeida,
    });
  }

  async obtenerTodas() {
    try {
      const docs = await this.model.find().populate('usuarioDestino').exec();
      return Promise.all(docs.map((doc) => this.deNotificacionDB(doc)));
    } catch (error) {
      throw new ObtenerTodasLasNotificacionesError(error.message);
    }
  }

  async obtenerNotificacionesPorLeidas(usuarioId, leidas) {

    try {
      const docs = await this.model.find({ usuarioDestino: usuarioId, leida: leidas }).populate('usuarioDestino').exec();
      return Promise.all(docs.map((doc) => this.deNotificacionDB(doc)));
    } catch (error) {
      throw new ObtenerNotificacionLeidaError(error.message);
    }
  }

  async buscarPorId(notificacionId) {
    try {
      const doc = await this.model.findById(notificacionId).populate("usuarioDestino").exec();
      return this.deNotificacionDB(doc);
    } catch (error) {
      throw new ObtenerNotificacionPorIdError(error.mensaje);
    }
  }

  async guardar(notificacion) {
    const docData = await this.aNotificacionDB(notificacion);
    const doc = new this.model(docData);
    const savedDoc = await doc.save();
    await savedDoc.populate("usuarioDestino")
    return this.deNotificacionDB(savedDoc);
  }

  async actualizar(notificacion) {
    if (!notificacion._id) {
      throw new ErrorActualizarNotificacion();
    }
    const updateData = {
      leida: notificacion.leida,
      fechaLeida: notificacion.fechaLeida,
    };
    const id = new mongoose.Types.ObjectId(notificacion._id);
    const updatedDoc = await this.model.findByIdAndUpdate(id, updateData, { new: true }).populate("usuarioDestino").exec();
    return this.deNotificacionDB(updatedDoc);
  }


  async listarTodas() {
    const docs = await this.model.find().populate("usuarioDestino").exec();
    return Promise.all(docs.map(doc => this.deNotificacionDB(doc)));
  }
}

export default new NotificacionesRepository();