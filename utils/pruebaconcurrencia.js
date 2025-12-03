import axios from "axios";
const pedido = {
  compradorId: "68e852e25816c4293bf6a1ad",
  moneda: "DOLAR_USA",
  direccionEntrega: {
        calle: "Calle Falsa",
        altura: "123",
        piso: "1",
        departamento: "A",
        codigoPostal: "12345",
        ciudad: "Springfield",
        provincia: "Illinois",
        pais: "USA",
        lat: "-34.6037",
        lon: "-58.3816"
    },
  items: [{ productoId: "68e852e25816c4293bf6a1af", cantidad: 6, precioUnitario: 100 }]
};

async function enviarPedido(nombre) {
  try {
    const res = await axios.post("http://localhost:3000/api/pedidos", pedido);
  } catch (err) {
  }
}

Promise.all([
  enviarPedido("Cliente A"),
  enviarPedido("Cliente B")
]);
