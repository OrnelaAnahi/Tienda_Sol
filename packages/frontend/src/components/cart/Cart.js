import React, { useContext, useEffect } from "react";
import cartContext from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
   const navigate = useNavigate();
    const {
        isCartOpen,
        cartItems,
        toggleCart,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart
    } = useContext(cartContext);

    useEffect(() => {
        const body = document.body;
        if (isCartOpen) body.classList.add("overflow_hide");
        else body.classList.remove("overflow_hide");
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    const cartTotal = cartItems.reduce((total, item) => {
        return total + item.precio * (item.quantity || 1);
    }, 0);

    return (
        <div className="cart-overlay" onClick={() => toggleCart(false)}>
            <div
                className="cart-panel"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cart-header">
                    <h2>
                        Carrito <small>({cartItems.length})</small>
                    </h2>
                    <div className="close_btn" onClick={() => toggleCart(false)}>
                        <span>&times;</span>
                    </div>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <h3>Tu carrito está vacío 🛒</h3>
                    ) : (
                        cartItems.map((item) => {
                            const { id, fotos, titulo, precio, quantity } = item;
                            const imagenUrl =
                                fotos && fotos.length > 0
                                    ? `/images/productos/${fotos[0]}`
                                    : "/images/placeholderProducto.jpg";
                            const subtotal = precio * (quantity || 1);

                            return (
                                <>
                                {quantity >= item.stock && <p>Stock máximo alcanzado</p>}
                                <div className="cart-item" key={id}>
                                    <img src={imagenUrl} alt={titulo} />
                                    <div>
                                        <h4>{titulo}</h4>
                                        <h3 className="price">
                                            {precio} x {quantity} = USD {subtotal.toFixed(2)}
                                        </h3>
                                    </div>
                                    <div className="cart-controls">
                                        <button onClick={() => decrementItem(id)}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={() => incrementItem(id)}>+</button>
                                    </div>
                                    <button onClick={() => removeItem(id)}>🗑️</button>
                                </div>
                                </>
                            );
                        })
                    )}
                </div>

                <div className="cart-footer">
                    <h3>
                        <small>Total:</small> <b>USD {cartTotal.toFixed(2)}</b>
                    </h3>
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        disabled={cartItems.length === 0}
                        onClick={() => { navigate("/checkout"); toggleCart(false); }}
                    >
                        Finalizar compra
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={cartItems.length === 0}
                        onClick={() => {
                            clearCart();
                        }}
                    >
                        Vaciar carrito
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Cart;
