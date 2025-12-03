import React, { useEffect, useState } from "react";
import "./ProductGrid.css";
import { obtenerProductosRecientes } from "../../api/axiosClient";

const ProductGrid = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await obtenerProductosRecientes();
        setProductos(response.data.data);
      } catch (err) {
        console.error("Error fetching productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleImageError = (e) => {
    e.target.src = "/images/placeholderProducto.jpg";
  };

  if (loading) {
    return (
      <section className="product-grid-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <div className="product-grid">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="product-card skeleton">
                <div className="product-image-skeleton"></div>
                <div className="product-info">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-grid-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-grid-section">
      <div className="container">
        <h2 className="section-title">New Arrivals</h2>
        <div className="product-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={
                    producto.fotos && producto.fotos.length > 0
                      ? `/images/productos/${producto.fotos[0]}`
                      : "/images/placeholderProducto.jpg"
                  }
                  alt={producto.titulo}
                  className="product-image"
                  loading="lazy"
                  onError={handleImageError}
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{producto.titulo}</h3>
                <p className="product-description">{producto.descripcion}</p>
                <div className="product-footer">
                  <span className="product-price">{producto.precio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
