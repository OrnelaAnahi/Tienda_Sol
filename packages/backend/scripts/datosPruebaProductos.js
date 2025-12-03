import { ProductoModel } from '../Schemas/ProductoSchema.js';
import { UsuarioModel } from '../Schemas/UsuarioSchema.js'; // Faltaba este import
import mongoose from 'mongoose';

export const crearDatosPruebaProductos = async () => {
    try {
        
        await ProductoModel.deleteMany({});
        await UsuarioModel.deleteMany({});
        
        
        const vendedor1 = await UsuarioModel.create({
            nombre: "Tech Store SA",
            email: "tech@store.com",
            telefono: "1122334455",
            tipo: "VENDEDOR"
        });

        const vendedor2 = await UsuarioModel.create({
            nombre: "Fashion World",
            email: "fashion@world.com", 
            telefono: "1199887766",
            tipo: "VENDEDOR"
        });

        const vendedor3 = await UsuarioModel.create({
            nombre: "Home & Garden",
            email: "home@garden.com",
            telefono: "1155443322",
            tipo: "VENDEDOR"
        });

        const productos = [
            
            {
                vendedor: vendedor1._id,
                titulo: "iPhone 14 Pro",
                descripcion: "Smartphone Apple con cámara profesional y pantalla ProMotion",
                categoria: ["electronica", "smartphones"],
                stock: 15,
                precio: 1200,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["iphone14pro.jpg"],
                cantidadVendida: 45
            },
            {
                vendedor: vendedor1._id,
                titulo: "MacBook Air M2",
                descripcion: "Laptop ultraligera con chip M2 y pantalla Retina",
                categoria: ["electronica", "computadoras"],
                stock: 8,
                precio: 1500,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["macbook.jpg"],
                cantidadVendida: 23
            },
            {
                vendedor: vendedor1._id,
                titulo: "iPad Pro 12.9",
                descripcion: "Tablet profesional con Apple Pencil compatible",
                categoria: ["electronica", "tablets"],
                stock: 12,
                precio: 800,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["ipad.jpg"],
                cantidadVendida: 67
            },
            {
                vendedor: vendedor1._id,
                titulo: "Samsung Galaxy S23",
                descripcion: "Smartphone Android con cámara de alta resolución",
                categoria: ["electronica", "smartphones"],
                stock: 20,
                precio: 900,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["galaxy.jpg"],
                cantidadVendida: 34
            },
            {
                vendedor: vendedor1._id,
                titulo: "AirPods Pro",
                descripcion: "Auriculares inalámbricos con cancelación de ruido",
                categoria: ["electronica", "audio"],
                stock: 25,
                precio: 250,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["airpods.jpg"],
                cantidadVendida: 89
            },
            {
                vendedor: vendedor1._id,
                titulo: "Monitor LG 4K",
                descripcion: "Monitor profesional 27 pulgadas 4K para diseño",
                categoria: ["electronica", "monitores"],
                stock: 5,
                precio: 400,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["monitor.jpg"],
                cantidadVendida: 12
            },
            {
                vendedor: vendedor1._id,
                titulo: "Teclado Mecánico RGB",
                descripcion: "Teclado gaming con switches mecánicos y retroiluminación",
                categoria: ["electronica", "gaming"],
                stock: 30,
                precio: 150,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["teclado.jpg"],
                cantidadVendida: 56
            },
            {
                vendedor: vendedor1._id,
                titulo: "Webcam Logitech 4K",
                descripcion: "Cámara web profesional para streaming y videollamadas",
                categoria: ["electronica", "accesorios"],
                stock: 18,
                precio: 200,
                moneda: "DOLAR_USA",
                activo: false, 
                fotos: ["webcam.jpg"],
                cantidadVendida: 78
            },

            
            {
                vendedor: vendedor2._id,
                titulo: "Zapatillas Nike Air Max",
                descripcion: "Zapatillas deportivas cómodas para running y uso diario",
                categoria: ["ropa", "calzado"],
                stock: 40,
                precio: 120,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["nike.jpg"],
                cantidadVendida: 234
            },
            {
                vendedor: vendedor2._id,
                titulo: "Jeans Levi's 501",
                descripcion: "Pantalones denim clásicos de corte recto",
                categoria: ["ropa", "pantalones"],
                stock: 50,
                precio: 80,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["jeans.jfif"],
                cantidadVendida: 156
            },
            {
                vendedor: vendedor2._id,
                titulo: "Camiseta Adidas",
                descripcion: "Remera deportiva de algodón transpirable",
                categoria: ["ropa", "remeras"],
                stock: 60,
                precio: 35,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["remera.jpg"],
                cantidadVendida: 89
            },

            
            {
                vendedor: vendedor3._id,
                titulo: "Cafetera Espresso",
                descripcion: "Máquina de café automática con molinillo integrado",
                categoria: ["hogar", "electrodomesticos"],
                stock: 10,
                precio: 300,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["cafetera.jpg"],
                cantidadVendida: 45
            },
            {
                vendedor: vendedor3._id,
                titulo: "Aspiradora Robot",
                descripcion: "Robot aspirador inteligente con mapeo láser",
                categoria: ["hogar", "limpieza"],
                stock: 15,
                precio: 250,
                moneda: "DOLAR_USA",
                activo: true,
                fotos: ["robot.jpg"],
                cantidadVendida: 67
            }
        ];

        
        const productosCreados = await ProductoModel.insertMany(productos);
        
        console.log('✅ Datos de prueba creados exitosamente!');
        console.log(`👥 3 vendedores creados`);
        console.log(`📦 ${productosCreados.length} productos creados`);
        console.log('\n📋 Vendedores para testear:');
        console.log(`🔹 Vendedor 1 (Tech Store): ${vendedor1._id}`);
        console.log(`🔹 Vendedor 2 (Fashion World): ${vendedor2._id}`);
        console.log(`🔹 Vendedor 3 (Home & Garden): ${vendedor3._id}`);
        
        return {
            vendedor1: vendedor1._id.toString(),
            vendedor2: vendedor2._id.toString(),
            vendedor3: vendedor3._id.toString(),
            productos: productosCreados
        };

    } catch (error) {
        console.error('❌ Error creando datos de prueba:', error);
        throw error;
    }
};

export const ejemplosTest = (vendedor1) => {
    const baseUrl = `http://localhost:3000/api/productos/vendedor/${vendedor1}`;
    
    console.log('\n🧪 URLs de ejemplo para testear:');
    console.log('\n1. Todos los productos del vendedor:');
    console.log(baseUrl);
    
    console.log('\n2. Filtro por rango de precio:');
    console.log(`${baseUrl}?min=200&max=1000`);
    
    console.log('\n3. Búsqueda por nombre:');
    console.log(`${baseUrl}?nombre=iPhone`);
    
    console.log('\n4. Filtro por categoría:');
    console.log(`${baseUrl}?categoria=smartphones`);
    
    console.log('\n5. Búsqueda en descripción:');
    console.log(`${baseUrl}?descripcion=profesional`);
    
    console.log('\n6. Paginación:');
    console.log(`${baseUrl}?page=1&size=3`);
    
    console.log('\n7. Ordenamiento por precio descendente:');
    console.log(`${baseUrl}?sort=price_desc`);
    
    console.log('\n8. Ordenamiento por más vendido:');
    console.log(`${baseUrl}?sort=most_sold`);
    
    console.log('\n9. Filtros combinados:');
    console.log(`${baseUrl}?min=100&max=500&categoria=electronica&page=1&size=5&sort=price_asc`);
    
    console.log('\n10. Búsqueda compleja:');
    console.log(`${baseUrl}?nombre=iPhone&categoria=smartphones&min=800&sort=most_sold`);
};