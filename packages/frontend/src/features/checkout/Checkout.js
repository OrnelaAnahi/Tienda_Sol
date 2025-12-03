import React, { useEffect } from "react";
import Formulario from "../../components/formulario/Formulario";
import { useState, useContext } from "react";
import cartContext from "../../context/CartContext";
import Modal from "../../components/modal/Modal";
import ModalSuccess from "../../components/modal/ModalSucces";
import ModalError from "../../components/modal/ModalError"
import ResumeCart from "../../components/resumeCart/ResumeCart"
import { useNavigate } from "react-router";
import "./Checkout.css"
import { set } from "mongoose";

export default function Checkout() {
  const { cartItems, clearCart } = useContext(cartContext);
  const navigate = useNavigate();

  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [pedido, setPedido] = useState({});
  const [carritoVacio, setCarritoVacio] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detalleCarrito, setDetalleCarrito] = useState([]);


  useEffect(() => {
    if (cartItems.length === 0) {
      setCarritoVacio(true);
    } else {
      setCarritoVacio(false);
    }
  }, [cartItems]);

  const handlePedidoSuccess = (pedido) => {
    setPedido(pedido);
    setModalSuccess(true);
    setDetalleCarrito(cartItems);
    clearCart();
  };

const handlePedidoError = (mensaje) => {
  setErrorMessage(mensaje || "Error desconocido al crear el pedido.");
  setModalError(true);
};

  return (
    <div className="checkout-container">
      <Modal />

      {modalSuccess && <ModalSuccess pedido={pedido} detalleCarrito={detalleCarrito} />}
      {modalError && <ModalError mensaje={errorMessage}/>}

      {carritoVacio ? (
        <div className="empty-cart-section">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>No se puede crear un pedido sin productos.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Volver al menú principal
          </button>
        </div>
      ) : (
        <>
          <ResumeCart />
          <h3 className="checkout-form-title">Datos del comprador</h3>
          <Formulario
            cartItems={cartItems}
            onSuccess={handlePedidoSuccess}
            onError={handlePedidoError}
          />
        </>
      )}
    </div>
  );
}