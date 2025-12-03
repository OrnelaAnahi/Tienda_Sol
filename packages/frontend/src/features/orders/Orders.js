import React, { useState } from 'react';
import { obtenerUsuarioPorEmail, obtenerPedidoPorUsuarioId } from '../../api/axiosClient'; 

export default function Orders() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usuario, setUsuario] = useState({ email: "" });
    const [pedidos, setPedidos] = useState([]);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    const handleChangeUsuario = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSearchMail = async () => {
        try {
            const user = await obtenerUsuarioPorEmail(usuario.email);
            const pedidos = await obtenerPedidoPorUsuarioId(user.data.id);
            setPedidos(pedidos.data);
        } catch (error) {
            setError(error.response?.data?.message || "Error al obtener pedido");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <>
            <div>
                <p>Ingrese su mail para ver sus pedidos</p>
                <input
                    className="formulario-input"
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={usuario.email}
                    onChange={handleChangeUsuario} />
                <button onClick={handleSearchMail}>Buscar</button>
            </div>
            <div>
                {pedidos.length > 0 ? (
                    <ul>
                        {pedidos.map((pedido) => (
                            <li key={pedido._id} className="pedido-item">
                                <p>Pedido ID: {pedido._id}</p>
                                <p>Estado: {pedido.estado}</p>
                                <p>Total: {pedido.total }</p>
                                <button onClick={() => setMostrarDetalle(!mostrarDetalle)}>Detalle pedido</button>
                                {(mostrarDetalle)
                                ?(
                                    <div>
                                        <h4>Productos del pedido:</h4>
                                        <ul>
                                            {pedido.items.map((producto) => (
                                                <li key={producto._id}>
                                                    <p>Producto: {producto.titulo}</p>
                                                    <p>Cantidad: {producto.cantidad}</p>
                                                    <p>Precio Unitario: {producto.precioUnitario}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron pedidos para este email.</p>
                )}
            </div>
        </>
    );
}