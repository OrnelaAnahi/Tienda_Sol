import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CartContext from "../../context/CartContext";
import "./ProductDetailCard.css"
export default function ProductDetailCard({ producto, onBack, onGoHome }) {
    const navigate = useNavigate();
    const { addItem, toggleCart } = useContext(CartContext);
    const [isAdded, setIsAdded] = useState(false);
    const imagenUrl =
        producto.fotos?.length > 0
            ? `/images/productos/${producto.fotos[0]}`
            : "/images/placeholderProducto.jpg";
    const handleAgregar = (e) => {
        e.stopPropagation();
        addItem(producto);
        toggleCart(true);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    return (
        <div className="product-detail-container">
            <button className="btn btn-link mb-4" onClick={onBack}>
                ← Volver
            </button>

            <div className="product-detail-content">
                <div className="product-detail-image-container">
                    <img
                        src={imagenUrl}
                        alt={producto.titulo}
                        className="product-detail-image"
                    />
                </div>

                <div className="product-detail-info">
                    <h1 className="product-detail-title">{producto.titulo}</h1>
                    <p className="product-detail-price">
                        <span className="price-tag">{producto.precio}</span>
                    </p>
                    <p className="product-detail-description">{producto.descripcion}</p>
                    <p className="product-detail-stock">Stock: {producto.stock}</p>
                    <p className="product-detail-stock">Vendedor: {producto.vendedor?.nombre || "Desconocido"}</p>
                    <p className="product-detail-categories">
                        <strong>Categorías:</strong>{" "}
                        {producto.categoria?.map((c) => c.nombre).join(" / ")}
                    </p>

                    <div className="product-detail-buttons">
                        <button
                            onClick={handleAgregar}
                            className={`btn btn-primary me-2 ${isAdded ? "added" : ""}`}
                            disabled={isAdded}
                        >
                            {isAdded ? "✅ Agregado" : "🛒 Agregar al carrito"}
                        </button>                        <button className="btn btn-outline-secondary" onClick={onGoHome}>
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

ProductDetailCard.propTypes = {
    producto: PropTypes.shape({
        titulo: PropTypes.string.isRequired,
        precio: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        stock: PropTypes.number.isRequired,
        categoria: PropTypes.arrayOf(
            PropTypes.shape({ nombre: PropTypes.string })
        ),
        fotos: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onBack: PropTypes.func.isRequired,
    onGoHome: PropTypes.func.isRequired,
};
