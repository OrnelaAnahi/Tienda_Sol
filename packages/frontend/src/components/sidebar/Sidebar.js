import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
    const [openTodos, setOpenTodos] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		const handleKey = (e) => {
			if (e.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<>
			<div className="sidebar-overlay" onClick={onClose} />
			<aside
				id="site-sidebar"
				className={`sidebar-panel`}
				role="dialog"
				aria-modal="true"
				aria-label="Menú principal"
			>
				<div className="sidebar-header">
					<button className="sidebar-close" aria-label="Cerrar menú" onClick={onClose}>
						×
					</button>
				</div>

				<nav className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/" onClick={onClose}>Inicio</Link>
                        </li>

                        <li className="sidebar-category">
                            <button
                                type="button"
                                className="category-btn"
                                aria-expanded={openTodos}
                                aria-controls="submenu-todos"
                                onClick={() => setOpenTodos((v) => !v)}
                            >
                                Productos
                            </button>

                            <ul id="submenu-todos" className={`submenu ${openTodos ? "open" : ""}`}>
                                <li>
                                    <Link to="/search" onClick={onClose}>Todos los productos</Link>
                                </li>
								<li>
                                    <Link to="/search?categoria=Ropa" onClick={onClose}>Ropa</Link>
                                </li>
                                <li>
                                    <Link to="/search?categoria=Electronica" onClick={onClose}>Electronica</Link>
                                </li>
								<li>
                                    <Link to="/search?categoria=Hogar" onClick={onClose}>Hogar</Link>
                                </li>
                            </ul>
                        </li>

                    </ul>
                </nav>
			</aside>
		</>
	);
}

Sidebar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};


