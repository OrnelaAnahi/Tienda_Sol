export class CrearUsuarioError extends Error {
    constructor(msj) {
        super("Error al crear el usuario. Motivo: " + msj);
    }
}

export class ListarUsuariosError extends Error {
    constructor() {
        super("Error al listar usuarios");
    }
}

export class UsuarioNoExistenteError extends Error{
    constructor(msj){
        super("El usuario no existe. Motivo: " + msj);
    }
}

export class UsuarioNoEncontradoError extends Error {
    constructor(msj) {
        super("Usuario no encontrado. Motivo: " + msj);
    }
}

export class ModificarUsuarioError extends Error {
    constructor(msj) {
        super("Error al modificar el usuario. Motivo: " + msj);
    }
}

export class EliminarUsuarioError extends Error {
    constructor(msj) {
        super("Error al eliminar el usuario. Motivo: " + msj);
    }
}
export class ErrorGuardarUsuario extends Error {
    constructor(msj) {
        super("Error al guardar el usuario. Motivo: " + msj);
    }
}