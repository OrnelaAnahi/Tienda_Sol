import React, { useState } from "react";
import "./Formulario.css";
import { obtenerUsuarioPorEmail, crearPedido } from "../../api/axiosClient";

export default function Formulario({ cartItems, onSuccess, onError }) {
  const [formDataUsuario, setFormDataUsuario] = useState({ email: "" });
  const [formDataPedido, setFormDataPedido] = useState({
    compradorId: "",
    items: [],
    moneda: "DOLAR_USA",
    direccionEntrega: {
      calle: "",
      altura: "",
      piso: "",
      departamento: "",
      codigoPostal: "",
      ciudad: "",
      provincia: "",
      pais: "USA",
      lat: "-34.6037",
      lon: "-58.3816",
    },
  });

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormDataUsuario({ ...formDataUsuario, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formDataPedido.direccionEntrega) {
      setFormDataPedido({
        ...formDataPedido,
        direccionEntrega: {
          ...formDataPedido.direccionEntrega,
          [name]: value,
        },
      });
    }
  };

  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    try {
      const idUser = await obtenerUsuarioPorEmail(formDataUsuario.email);

      const pedido = {
        ...formDataPedido,
        compradorId: idUser.data.id,
        items: cartItems.map((item) => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio,
        })),
      };

      const response = await crearPedido(pedido);
      if (response.status >= 200 && response.status < 300 && response.data?._id) {
        onSuccess(response.data);
      } else {
        const msg = response.data?.mensaje || response.data?.error || "Error desconocido al crear el pedido.";
        onError(msg);
      }

    } catch (error) {
      console.error("Error al crear pedido:", error);
      const backendMsg =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Ocurrió un error al crear el pedido.";
      onError(backendMsg);
    }
  };

  return (
    <form onSubmit={handleSubmitPedido} className="formulario">
      <h4 className="formulario h4">
        Ingrese la dirección de entrega y verifique su correo electrónico
      </h4>

      <input
        className="formulario-input"
        required
        type="email"
        name="email"
        placeholder="Email"
        value={formDataUsuario.email}
        onChange={handleChangeUsuario}
      />

      <div className="formulario address-group">
        <h5>Dirección de Entrega:</h5>
        <input
          className="formulario-input"
          required
          type="text"
          name="calle"
          placeholder="Calle"
          value={formDataPedido.direccionEntrega.calle}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          required
          type="number"
          name="altura"
          placeholder="Altura"
          value={formDataPedido.direccionEntrega.altura}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          type="number"
          name="piso"
          placeholder="Piso"
          value={formDataPedido.direccionEntrega.piso}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={formDataPedido.direccionEntrega.departamento}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          required
          type="number"
          name="codigoPostal"
          placeholder="Código Postal"
          value={formDataPedido.direccionEntrega.codigoPostal}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          required
          type="text"
          name="provincia"
          placeholder="Provincia"
          value={formDataPedido.direccionEntrega.provincia}
          onChange={handleChange}
        />
        <input
          className="formulario-input"
          required
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={formDataPedido.direccionEntrega.ciudad}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-success">
        Enviar pedido
      </button>
    </form>
  );
}
