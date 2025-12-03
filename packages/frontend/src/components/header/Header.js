import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { CiMenuBurger, CiShoppingCart, CiSearch } from "react-icons/ci";
import Sidebar from "../sidebar/Sidebar.js";
import cartContext from "../../context/CartContext.js";
import { IoBagOutline } from "react-icons/io5";

export default function Header() {
    const [busqueda, setBusqueda] = useState("");
    const [sidebar, setSidebar] = useState(false);
    const { cartItems, toggleCart } = useContext(cartContext);
    const cartQuantity = cartItems.length;
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (busqueda.trim()) navigate(`/search?q=${busqueda}`);
    };

    const handleEnter = (e) => {
        if (e.key === "Enter") handleSearch(e);
    };

    const handleBagClick = () => {
        navigate("/orders");
    };

    return (
        <header className="header">
            <div className="header-left">
                <button
                    className="menu-btn"
                    title="Abrir menú"
                    onClick={() => setSidebar(!sidebar)}
                >
                    <CiMenuBurger size={30} />
                </button>
                <Sidebar isOpen={sidebar} onClose={() => setSidebar(false)} />
            </div>

            <div className="header-center">
                <CiSearch className="search-icon" size={25} />
                <input
                    className="search-input"
                    type="text"
                    placeholder="Buscar productos"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={handleEnter}
                />
            </div>

            <div className="header-right">
                <button className="cart-btn" title="Mis pedidos" onClick={handleBagClick}>
                <IoBagOutline size={30} />
                </button>
            </div>

            <div className="header-right">
                <button
                    className="cart-btn"
                    title="Carrito de compras"
                    onClick={() => toggleCart(true)}
                >
                    <CiShoppingCart size={30} />
                    {cartQuantity > 0 && (
                        <span className="cart-badge">{cartQuantity}</span>
                    )}
                </button>
            </div>
        </header>
    );
}
