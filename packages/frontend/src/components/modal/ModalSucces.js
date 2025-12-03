import { useState, useEffect } from "react";
import "./Modal.css";
import { useNavigate } from "react-router-dom";

export default function ModalSuccess({ pedido, detalleCarrito }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMostrarModal(true);
    }, []);

    if (!mostrarModal) return null;
    const handleVolverInicio = () => {
        navigate("/");
    };
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>¡Compra Exitosa!</h2>
                <p>Tu pedido ha sido procesado con éxito.</p>
                <p>Su numero de pedido es: <strong>{pedido._id} </strong>  </p>
                <p>Detalle del pedido:</p>
                {detalleCarrito.map((item) => (
                    <div key={item.id} className="pedido-item">
                        <li>
                        <p>Producto: {item.titulo}</p>
                        <p>Cantidad: {item.quantity}</p>
                        <p>Precio Unitario: USD {item.precio.toFixed(2)}</p>
                        </li>
                    </div>
                ))}
                <button type="button" className="btn btn-success" onClick={handleVolverInicio}>Volver al inicio</button>
            </div>
        </div>
    );
}