import React, { useContext } from "react";
import cartContext from "../../context/CartContext";
import "./ResumeCart.css";

export default function ResumeCart() {
  const { cartItems, incrementItem, decrementItem, removeItem } =
    useContext(cartContext);

  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.precio * (item.quantity || 1);
  }, 0);

  if (cartItems.length === 0) {
    return <p className="empty-cart">Tu carrito está vacío.</p>;
  }

  return (
    <div className="checkout-summary">
      <h2 className="checkout-title">Resumen de la compra 🛍️</h2>

      {cartItems.map((item) => {
        const { id, fotos, titulo, precio, quantity } = item;
        const imagenUrl =
          fotos && fotos.length > 0
            ? `/images/productos/${fotos[0]}`
            : "/images/placeholderProducto.jpg";
        const subtotal = precio * (quantity || 1);

        return (
          <div className="checkout-item" key={id}>
            <img src={imagenUrl} alt={titulo} className="checkout-item-img" />
            <div className="checkout-item-info">
              <h4>{titulo}</h4>
              <p>Precio unitario: USD {precio.toFixed(2)}</p>
              <p>
                Cantidad:{" "}
                <button onClick={() => decrementItem(id)} className="qty-btn">
                  −
                </button>
                <span className="qty">{quantity}</span>
                <button onClick={() => incrementItem(id)} className="qty-btn">
                  +
                </button>
              </p>
              <p className="subtotal">
                Subtotal: <b>USD {subtotal.toFixed(2)}</b>
              </p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeItem(id)}
              title="Eliminar producto"
            >
              🗑️
            </button>
          </div>
        );
      })}

      <div className="checkout-total">
        <h3>Total: USD {cartTotal.toFixed(2)}</h3>
      </div>
    </div>
  );
}
