import { Usuario } from "../domain/Usuario.js";
import {UsuarioNoEncontradoError, CrearUsuarioError, UsuarioNoExistenteError} from "../excepciones/usuario.js";

export class UsuarioController {

    constructor(usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
    }

    async crearUsuario(req, res) {
        const datosUsuario = req.body;
        try {
            if (await this.usuariosRepository.findByEmail(datosUsuario.email) != null) {
                return res.status(400).json({ mensaje: "El email ya está en uso" });
            }
            const usuario = new Usuario(datosUsuario);
            const usuarioGuardado = await this.usuariosRepository.save(usuario);
            res.status(201).json(usuarioGuardado);
        } catch (error) {
            if (error instanceof CrearUsuarioError) {
                return res.status(400).json({ mensaje: error.message });
            }
            return res.status(500).json({ mensaje: "Error al crear el usuario" });
        }
    }

    async obtenerTodosLosUsuarios(req, res) {
        try {
            const usuarios = await this.usuariosRepository.findAll();
            if(!usuarios){
                throw new UsuarioNoEncontradoError();
            }
            res.json(usuarios);
        } catch (error) {
            if (error instanceof UsuarioNoEncontradoError) {
                return res.status(400).json({ mensaje: error.message });
            }
            return res.status(500).json({ mensaje: "Error al obtener los usuarios" });
        }
    }

    async obtenerUsuarioPorId(req, res) {
        const { id } = req.params;
        try {
            const usuario = await this.usuariosRepository.findById(id);
            if(!usuario){
                throw new UsuarioNoExistenteError();
            }
            res.json(usuario);
        } catch (error) {
            if (error instanceof UsuarioNoExistenteError) {
                return res.status(404).json({ mensaje: error.message });
            }
            return res.status(500).json({ mensaje: "Error al obtener el usuario por id" });
        }
    }

    async obtenerUsuarioIdPorMail(req, res) {
        const { email } = req.params;
        try {
            const usuario = await this.usuariosRepository.findByEmail(email);
            if(!usuario){
                throw new UsuarioNoExistenteError();
            }
            return res.json({ id: usuario._id });
        } catch (error) {
            if (error instanceof UsuarioNoExistenteError) {
                return res.status(404).json({ mensaje: error.message });
            }
            return res.status(500).json({ mensaje: "Error al obtener el usuario por email" });
        }
    }
}