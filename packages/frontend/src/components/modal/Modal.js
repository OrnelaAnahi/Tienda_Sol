import React, { useEffect, useState } from "react";
import "./Modal.css";
import { crearUsuario } from "../../api/axiosClient";

export default function Modal() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [formDataUsuario, setFormDataUsuario] = useState({
        nombre: "",
        email: "",
        telefono: ""
    });

    useEffect(() => {
        setMostrarModal(true);
    }, []);

    const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formDataUsuario) {
      setFormDataUsuario({
        ...formDataUsuario,
        [name]: value
      });
    }
  };

    const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      const response = await crearUsuario(formDataUsuario);
      alert("Usuario creado correctamente");
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al crear usuario:", error.response.data.mensaje);
      if(error.response.status == 400){
        alert(error.response.data.mensaje);
      } 
    }
  };

    const handleYaRegistrado = () => {
        setMostrarModal(false);
    };

    if (!mostrarModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Confirmar usuario</h2>
                <p className="modal-text">¿Usted se encuentra registrado? En caso afirmativo, por favor ingrese su mail
                    con el cual se registro. En caso de ser la primera vez comprando, complete los siguientes datos: </p>
                <form onSubmit={handleSubmitUser} className="formulario">
                    <h4 className="formulario h4">Registrese, en caso de ya haberse registrado ingrese su mail</h4>
                    <input className="formulario-input"
                        required
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={formDataUsuario.nombre}
                        onChange={handleChange}
                    />
                    <input className="formulario-input"
                        required
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formDataUsuario.email}
                        onChange={handleChange}
                    />
                    <input className="formulario-input"
                        required
                        type="number"
                        min="1000000000" max="9999999999"
                        name="telefono"
                        placeholder="Teléfono"
                        value={formDataUsuario.telefono}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-success">Crear Usuario</button>
                     <button className="btn btn-danger" onClick={handleYaRegistrado}>
                        Ya estoy registrado
                    </button>
                </form>
            </div>
        </div>
    );
}
