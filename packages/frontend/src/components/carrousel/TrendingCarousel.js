import React, { useEffect, useState } from "react";
import HorizontalCarousel from "./HorizontalCarousel.js";
import "./TrendingCarousel.css";
import ProductCard from "../productCard/ProductCard.js";
import { obtenerProductos } from "../../api/axiosClient.js";

export default function TrendingCarousel() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerTrending = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await obtenerProductos("sort=most_sold");
                setProductos(response.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Error al obtener productos trending");
                console.error("Error fetcheando", err);
            } finally {
                setLoading(false);
            }
        };

        obtenerTrending();
    }, []);

    if (loading) {
        return (
            <div className="trending-carousel-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando productos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trending-carousel-error alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="trending-carousel-empty alert alert-info">
                <p>No hay productos trending disponibles</p>
            </div>
        );
    }

    return (
        <div className="trending-carousel-wrapper">
            <h2 className="trending-carousel-heading">En tendencia</h2>
            <HorizontalCarousel
                items={productos}
                renderCard={(p) => <ProductCard producto={p} />}
                className="trending-carousel"
            />
        </div>
    );
}