import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

export default function ModalError({ mensaje }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setMostrarModal(true);
    }, []);

    if (!mostrarModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container error">
                <h2>❌ Error al procesar el pedido</h2>
                <p>Ocurrió un problema al intentar crear tu pedido.</p>
                {mensaje && (
                    <p className="error-msg">
                        <strong>Detalles:</strong> {mensaje}
                    </p>
                )}
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => navigate("/")}
                >
                    Volver al menú principal
                </button>
            </div>
        </div>
    );
}
