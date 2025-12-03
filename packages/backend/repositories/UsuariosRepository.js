import { UsuarioModel } from "../Schemas/UsuarioSchema.js";
import { Usuario } from "../domain/Usuario.js";

export class UsuariosRepository {
  constructor() {
    this.model = UsuarioModel;
  }

  aUsuarioDB(usuario) {
    return {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      tipo: usuario.tipo,
      fechaAlta: usuario.fechaAlta,
    };
  }

  aUsuario(usuarioDB) {
    if (!usuarioDB) return null;

    return new Usuario({
      _id: usuarioDB._id?.toString(),
      nombre: usuarioDB.nombre,
      email: usuarioDB.email,
      telefono: usuarioDB.telefono,
      tipo: usuarioDB.tipo,
      fechaAlta: usuarioDB.fechaAlta,
    });
  }

  async save(usuario) {
    try {
      const usuarioDB = this.aUsuarioDB(usuario);
      const usuarioGuardado = await this.model.create(usuarioDB);
      return this.aUsuario(usuarioGuardado);
    } catch (error) {
      throw new Error("Error al guardar el usuario");
    }
  }

  async findById(id) {
    try {
      const usuario = await this.model.findById(id).lean();
      return this.aUsuario(usuario);
    } catch (error) {
      throw new Error("Error al buscar el usuario");
    }
  }

  async findAll() {
    try {
      const usuarios = await this.model.find().lean();
      return usuarios.map((u) => this.aUsuario(u));
    } catch (error) {
      throw new Error("Error al buscar todos los usuarios");
    }
  }

  async findByEmail(email) {
    try {
      const usuario = await this.model.findOne({ email }).lean();
      return this.aUsuario(usuario);
    } catch (error) {
      throw new Error("Error al buscar el usuario por email");
    }
  }

  async existeVendedor(id) {
    try {
      const usuario = await this.model
        .findOne({ _id: id, tipo: "VENDEDOR" })
        .lean();
      return usuario !== null;
    } catch (error) {
      throw new Error("Error al verificar si el usuario es vendedor");
    }
  }
}
