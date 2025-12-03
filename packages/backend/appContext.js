import { UsuariosRepository } from "./repositories/UsuariosRepository.js"
import { ProductosRepository } from "./repositories/ProductosRepository.js"
import { PedidosRepository } from "./repositories/PedidosRepository.js"
import { ProductosController } from "./controllers/ProductosController.js";
import { PedidosController } from "./controllers/PedidosController.js";
import { NotificacionesController } from "./controllers/NotificacionesController.js";
import { UsuarioController } from "./controllers/UsuarioController.js";
import  NotificacionesRepository  from "./repositories/NotificacionesRepository.js";

export const buildAppContext = (connection) => {
    // repos
    const usuariosRepository = new UsuariosRepository();
    const productosRepository = new ProductosRepository();
    const pedidosRepository = new PedidosRepository();

    //controllers
    const productosController = new ProductosController(productosRepository, usuariosRepository);
    const pedidosController = new PedidosController(pedidosRepository, productosRepository, usuariosRepository);
    const notificacionesController = new NotificacionesController(NotificacionesRepository);
    const usuariosController = new UsuarioController(usuariosRepository);

    return {
        usuariosRepository,
        productosRepository,
        pedidosRepository,
        usuariosController,
        productosController,
        pedidosController,
        notificacionesController
    }
}