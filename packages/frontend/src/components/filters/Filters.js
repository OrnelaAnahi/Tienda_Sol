import React, { useState } from "react";
import "./Filters.css";

function ProductFilters({ onFilterChange, activeFilters }) {
  const [priceMin, setPriceMin] = useState(activeFilters.min || "");
  const [priceMax, setPriceMax] = useState(activeFilters.max || "");
  const [searchCategory, setSearchCategory] = useState(
    activeFilters.categoria || ""
  );
  const [searchDescription, setSearchDescription] = useState(
    activeFilters.descripcion || ""
  );

  const handleFiltros = () => {
    const filters = {};

    if (priceMin) filters.min = priceMin;
    if (priceMax) filters.max = priceMax;
    if (searchCategory) filters.categoria = searchCategory;
    if (searchDescription) filters.descripcion = searchDescription;

    onFilterChange(filters);
  };

  const handleLimpiarFiltros = () => {
    setPriceMin("");
    setPriceMax("");
    setSearchCategory("");
    setSearchDescription("");
    onFilterChange({});
  };

  const hasActiveFilters =
    priceMin || priceMax || searchCategory || searchDescription;

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h5>Filtros de búsqueda</h5>
        {hasActiveFilters && (
          <button
            className="btn btn-link btn-sm text-decoration-none p-0"
            onClick={handleLimpiarFiltros}
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="filter-section">
        <h6 className="filter-title">Precio</h6>
        <div className="price-inputs">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Mínimo"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Máximo"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="filter-section">
        <h6 className="filter-title">Buscar por categoría</h6>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Nombre de la categoría"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />
      </div>

      <div className="filter-section">
        <h6 className="filter-title">Buscar en descripcion</h6>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Texto en la descripción"
          value={searchDescription}
          onChange={(e) => setSearchDescription(e.target.value)}
        />
      </div>
      <div className="filter-actions">
        <button className="btn btn-primary w-100" onClick={handleFiltros}>
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

export default ProductFilters;
