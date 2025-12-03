import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import { buildAppContext } from "../utils/appContext.js";
import { configureRoutes } from "../utils/router.js";
import { UsuarioModel } from "../utils/Schemas/UsuarioSchema.js";

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  const appContext = buildAppContext(mongoose.connection);
  configureRoutes(app, appContext);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Tests de Integración HTTP", () => {
  describe("Creación de pedidos", () => {
    test("debería crear un pedido correctamente", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "Juan Pérez",
        email: "juan@test.com",
        telefono: "1122334455",
        tipo: "COMPRADOR",
      });

      const vendedor = await UsuarioModel.create({
        nombre: "Tech Store",
        email: "tech@test.com",
        telefono: "1133445566",
        tipo: "VENDEDOR",
      });

      const productoRes = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Camiseta Test",
          descripcion: "Camiseta de prueba",
          categoria: ["ropa"],
          precio: 100,
          stock: 10,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const productoId = productoRes.body.data._id;

      const pedidoRes = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [{ productoId: productoId, cantidad: 2, precioUnitario: 100 }],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Av. Corrientes",
            altura: "1234",
            ciudad: "Buenos Aires",
            provincia: "CABA",
            pais: "Argentina",
            codigoPostal: "C1043",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(201);

      expect(pedidoRes.body).toHaveProperty("_id");
      expect(pedidoRes.body.items[0].cantidad).toBe(2);
    });

    test("debería crear un pedido con multiples productos", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "María García",
        email: "maria@test.com",
        telefono: "1199887766",
        tipo: "COMPRADOR",
      });

      const vendedor = await UsuarioModel.create({
        nombre: "Fashion Store",
        email: "fashion@test.com",
        telefono: "1177889900",
        tipo: "VENDEDOR",
      });

      const prod1 = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto 1",
          categoria: ["testCat"],
          stock: 10,
          precio: 50,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const prod2 = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto 2",
          categoria: ["testCat"],
          stock: 5,
          precio: 100,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const pedidoRes = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [
            {
              productoId: prod1.body.data._id,
              cantidad: 2,
              precioUnitario: 50,
            },
            {
              productoId: prod2.body.data._id,
              cantidad: 1,
              precioUnitario: 100,
            },
          ],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Calle Falsa",
            altura: "123",
            ciudad: "Buenos Aires",
            provincia: "CABA",
            pais: "Argentina",
            codigoPostal: "C1234",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(201);

      expect(pedidoRes.body.items).toHaveLength(2);
    });

    test("debería fallar si no se envía producto en el pedido", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "Pedro López",
        email: "pedro@test.com",
        telefono: "1155443322",
        tipo: "COMPRADOR",
      });

      const res = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Test",
            altura: "123",
            ciudad: "Test",
            provincia: "Test",
            pais: "Test",
            codigoPostal: "1234",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });
  });

  describe("Casos de error - validación de datos", () => {
    test("debería fallar con comprador inválido", async () => {
      const vendedor = await UsuarioModel.create({
        nombre: "Home Store",
        email: "home@test.com",
        telefono: "1144556677",
        tipo: "VENDEDOR",
      });

      const prod = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Test",
          categoria: ["test"],
          stock: 10,
          precio: 100,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: "invalid-id",
          items: [
            {
              productoId: prod.body.data._id,
              cantidad: 1,
              precioUnitario: 100,
            },
          ],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Test",
            altura: "1",
            ciudad: "Test",
            provincia: "Test",
            pais: "Test",
            codigoPostal: "1234",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(400);

      expect(res.body).toHaveProperty("error");
    });

    test("debería fallar con cantidad negativa", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "Ana Martínez",
        email: "ana@test.com",
        telefono: "1166778899",
        tipo: "COMPRADOR",
      });

      const vendedor = await UsuarioModel.create({
        nombre: "Electronics Store",
        email: "electronics@test.com",
        telefono: "1188990011",
        tipo: "VENDEDOR",
      });

      const prod = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Test",
          categoria: ["test"],
          stock: 10,
          precio: 100,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [
            {
              productoId: prod.body.data._id,
              cantidad: -1,
              precioUnitario: 100,
            },
          ],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Test",
            altura: "1",
            ciudad: "Test",
            provincia: "Test",
            pais: "Test",
            codigoPostal: "1234",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(400);
    });

    test("debería fallar sin dirección de entrega", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "Carlos Rodríguez",
        email: "carlos@test.com",
        telefono: "1133445566",
        tipo: "COMPRADOR",
      });

      const vendedor = await UsuarioModel.create({
        nombre: "Sports Store",
        email: "sports@test.com",
        telefono: "1122334455",
        tipo: "VENDEDOR",
      });

      const prod = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Test",
          categoria: ["test"],
          stock: 10,
          precio: 100,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [
            {
              productoId: prod.body.data._id,
              cantidad: 1,
              precioUnitario: 100,
            },
          ],
          moneda: "PESO_ARS",
        })
        .expect(400);
    });
  });

  describe("Casos de error - stock insuficiente", () => {
    test("debería fallar si no hay stock suficiente", async () => {
      const comprador = await UsuarioModel.create({
        nombre: "Laura Fernández",
        email: "laura@test.com",
        telefono: "1177889900",
        tipo: "COMPRADOR",
      });

      const vendedor = await UsuarioModel.create({
        nombre: "Limited Store",
        email: "limited@test.com",
        telefono: "1199887766",
        tipo: "VENDEDOR",
      });

      const prod = await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Stock Limitado",
          categoria: ["test"],
          stock: 2,
          precio: 100,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .post("/api/pedidos")
        .send({
          compradorId: comprador._id.toString(),
          items: [
            {
              productoId: prod.body.data._id,
              cantidad: 10,
              precioUnitario: 100,
            },
          ],
          moneda: "PESO_ARS",
          direccionEntrega: {
            calle: "Test",
            altura: "1",
            ciudad: "Test",
            provincia: "Test",
            pais: "Test",
            codigoPostal: "1234",
            lat: "-34.603722",
            lon: "-58.381592",
          },
        })
        .expect(400);

      expect(res.body.error).toMatch(/stock/i);
    });
  });

  describe("Búsqueda de productos", () => {
    test("debería devolver los productos disponibles", async () => {
      const vendedor = await UsuarioModel.create({
        nombre: "Shoes Store",
        email: "shoes@test.com",
        telefono: "1155667788",
        tipo: "VENDEDOR",
      });

      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Zapatillas Test",
          descripcion: "Zapatillas deportivas",
          categoria: ["calzado"],
          precio: 200,
          stock: 5,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app).get("/api/productos").expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty("titulo", "Zapatillas Test");
    });

    test("debería devolver solo productos del vendedor especificado", async () => {
      const vendedor1 = await UsuarioModel.create({
        nombre: "Tech Store",
        email: "tech@test.com",
        telefono: "1122334455",
        tipo: "VENDEDOR",
      });

      const vendedor2 = await UsuarioModel.create({
        nombre: "Fashion Store",
        email: "fashion@test.com",
        telefono: "1133445566",
        tipo: "VENDEDOR",
      });


      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor1._id.toString() },
          titulo: "Laptop",
          descripcion: "Laptop gaming",
          categoria: ["tecnologia"],
          precio: 1000,
          stock: 5,
          moneda: "PESO_ARS",
        })
        .expect(201);

      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor1._id.toString() },
          titulo: "Mouse",
          descripcion: "Mouse inalámbrico",
          categoria: ["tecnologia"],
          precio: 50,
          stock: 20,
          moneda: "PESO_ARS",
        })
        .expect(201);

  
      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor2._id.toString() },
          titulo: "Remera",
          descripcion: "Remera deportiva",
          categoria: ["ropa"],
          precio: 30,
          stock: 15,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .get(`/api/productos/vendedor/${vendedor1._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].vendedor).toHaveProperty("nombre", "Tech Store");
      expect(res.body.data[1].vendedor).toHaveProperty("nombre", "Tech Store");
    });

    test("debería filtrar productos por precio mínimo y máximo", async () => {
      const vendedor = await UsuarioModel.create({
        nombre: "Multi Store",
        email: "multi@test.com",
        telefono: "1144556677",
        tipo: "VENDEDOR",
      });

      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Barato",
          descripcion: "Económico",
          categoria: ["varios"],
          precio: 50,
          stock: 10,
          moneda: "PESO_ARS",
        })
        .expect(201);

      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Medio",
          descripcion: "Precio medio",
          categoria: ["varios"],
          precio: 100,
          stock: 10,
          moneda: "PESO_ARS",
        })
        .expect(201);

      await request(app)
        .post("/api/productos")
        .send({
          vendedor: { _id: vendedor._id.toString() },
          titulo: "Producto Caro",
          descripcion: "Premium",
          categoria: ["varios"],
          precio: 200,
          stock: 10,
          moneda: "PESO_ARS",
        })
        .expect(201);

      const res = await request(app)
        .get(`/api/productos/vendedor/${vendedor._id}?min=80&max=150`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty("titulo", "Producto Medio");
      expect(res.body.data[0].precio).toContain("100");
    });


    test("debería paginar correctamente los resultados", async () => {
      const vendedor = await UsuarioModel.create({
        nombre: "Big Store",
        email: "big@test.com",
        telefono: "1155667788",
        tipo: "VENDEDOR",
      });

     
      for (let i = 1; i <= 15; i++) {
        await request(app)
          .post("/api/productos")
          .send({
            vendedor: { _id: vendedor._id.toString() },
            titulo: `Producto ${i}`,
            descripcion: `Descripción del producto ${i}`,
            categoria: ["test"],
            precio: i * 10,
            stock: 5,
            moneda: "PESO_ARS",
          })
          .expect(201);
      }

      const page1 = await request(app)
        .get(`/api/productos/vendedor/${vendedor._id}?page=1&size=10`)
        .expect(200);

      expect(page1.body.success).toBe(true);
      expect(page1.body.data).toHaveLength(10);
      expect(page1.body.pagination).toHaveProperty("currentPage", 1);
      expect(page1.body.pagination).toHaveProperty("totalPages", 2);
      expect(page1.body.pagination).toHaveProperty("totalItems", 15);

    
      const page2 = await request(app)
        .get(`/api/productos/vendedor/${vendedor._id}?page=2&size=10`)
        .expect(200);

      expect(page2.body.success).toBe(true);
      expect(page2.body.data).toHaveLength(5);
      expect(page2.body.pagination).toHaveProperty("currentPage", 2);
      expect(page2.body.pagination).toHaveProperty("totalPages", 2);
    });
  });

  describe("Búsqueda de productos - casos de error", () => {
    test("debería devolver array vacío cuando no hay productos", async () => {
      const res = await request(app).get("/api/productos").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });

    test("debería retornar error con vendedor inexistente", async () => {
      const vendedorInexistente = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/productos/vendedor/${vendedorInexistente}`)
        .expect(404);

      expect(res.body.message).toMatch(/vendedor/i);
    });

    test("debería fallar con ID de vendedor inválido", async () => {
      const res = await request(app)
        .get("/api/productos/vendedor/invalid-id")
        .expect(400);
    });
  });
});
