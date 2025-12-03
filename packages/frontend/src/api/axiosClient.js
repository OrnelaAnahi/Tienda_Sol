import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

export const obtenerProductos = (filtro) => {
  return axios.get(`${API_URL}/productos` + (filtro ? `?${filtro}` : ''));
}

export const obtenerUsuarioPorEmail = (email) => {
  return axios.get(`${API_URL}/usuarios/email/${email}`);
};

export const crearPedido = (pedido) => {
  return axios.post(`${API_URL}/pedidos`, pedido);
};

export const crearUsuario = (usuario) => {
  return axios.post(`${API_URL}/usuarios`, usuario);
};

export const obtenerPedidoPorUsuarioId = (usuarioId) => {
  return axios.get(`${API_URL}/pedidos`, { params: { usuarioId } });
};

export const obtenerProductoPorId = (id) => {
  return axios.get(`${API_URL}/productos/${id}`);
};

export const obtenerProductosSearch = (params) => {
  return fetch(`${API_URL}/productos?${params}`);
};

export default axios;