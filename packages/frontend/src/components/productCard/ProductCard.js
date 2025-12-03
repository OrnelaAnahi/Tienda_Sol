import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import "./productCard.css"

export default function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { addItem, toggleCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const imagenUrl =
    producto.fotos && producto.fotos.length > 0
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
    <div
      className="trending-product-card"
      onClick={() => navigate(`/productos/${producto.id}`)}
    >
      <div className="trending-product-image-container">
        <img
          src={imagenUrl}
          alt={producto.titulo}
          className="trending-product-image"
        />
      </div>

      <div className="trending-product-info">
        <h3 className="trending-product-title">{producto.titulo}</h3>
        <p className="trending-product-price">${producto.precio}</p>

        <button
          onClick={handleAgregar}
          className={`btn btn-primary me-2 ${isAdded ? "added" : ""}`}
          disabled={isAdded}
        >
          {isAdded ? "✅ Agregado" : "🛒 Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
