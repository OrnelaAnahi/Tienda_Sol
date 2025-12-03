import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailCard from "../../components/productDetail/ProductDetailCard";
import "./ProductDetail.css";
import { obtenerProductoPorId } from "../../api/axiosClient";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const { data } = await obtenerProductoPorId(id);
                setProducto(data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Error al obtener detalle del producto");
            } finally {
                setLoading(false);  
            }
          };
        fetchProducto();
    }, []);

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;
    if (!producto) return <div className="alert alert-warning text-center mt-5">Producto no encontrado</div>;

    return (
        <div className="product-detail-page">
            <ProductDetailCard
                producto={producto}
                onBack={() => navigate(-1)}
                onGoHome={() => navigate("/")}
              />
        </div>
    );
}
