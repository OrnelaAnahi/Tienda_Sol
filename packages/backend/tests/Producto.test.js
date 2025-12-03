import { Producto } from "../domain/Producto.js";
import { CantidadNegativaError, StockInsuficienteError } from "../excepciones/producto.js";


describe("Producto", () => {
  const datosValidos = {
    vendedor: "507f1f77bcf86cd799439011",
    titulo: "iPhone 14",
    categoria: [{ nombre: "smartphones" }],
    stock: 10,
    precio: 999.99,
    moneda: "DOLAR_USA",
  };

  describe("constructor", () => {
    test("Debe crear una instancia con datos válidos", () => {
      const producto = new Producto(datosValidos);

      expect(producto.vendedor).toBe(datosValidos.vendedor);
      expect(producto.titulo).toBe(datosValidos.titulo);
      expect(producto.stock).toBe(datosValidos.stock);
      expect(producto.activo).toBe(true);
      expect(producto.fotos).toEqual([]);
      expect(producto.cantidadVendida).toBe(0);
    });

    test("Debe lanzar error con datos inválidos", () => {
      const datosInvalidos = { ...datosValidos, precio: -100 };
      expect(() => new Producto(datosInvalidos)).toThrow("El precio debe ser positivo");
    });
  });

  describe('estaDisponible',()=>{
    test('Debe retornar true cuando hay stock suficiente y esta activo',() => {
        const producto = new Producto(datosValidos);

        expect(producto.estaDisponible(5)).toBe(true);
    });

    test('Debe retornar false cuando no hay stock suficiente',() => {
        const producto = new Producto(datosValidos);
        expect(producto.estaDisponible(15)).toBe(false);
    });

    test('Debe retornar false cuando el producto no esta activo',() => {
        const producto = new Producto({...datosValidos, activo: false});
        expect(producto.estaDisponible(5)).toBe(false);
    });
  });

  describe('reducirStock', () => {
    test('Debe reducir stock correctamente', () => {
        const producto = new Producto(datosValidos);
        producto.reducirStock(3);
        expect(producto.stock).toBe(7);
    });
    test('Debe fallar con cantidad negativa', () => {
        const producto = new Producto(datosValidos);
        expect(() => producto.reducirStock(-2)).toThrow(CantidadNegativaError);
    });

    test('Debe fallar con stock insuficiente', () => {
        const producto = new Producto(datosValidos);
        expect(() => producto.reducirStock(20)).toThrow(StockInsuficienteError);
    });
  });

  describe('obtenerVendedor', () => {
    test('Debe retornar el ID del vendedor', () => {
        const producto = new Producto(datosValidos);
        expect(producto.obtenerVendedor()).toBe(datosValidos.vendedor);
    });
  });
});
