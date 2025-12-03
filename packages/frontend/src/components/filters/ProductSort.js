import React from 'react';
import './ProductSort.css';

function ProductSort({ currentSort, onSortChange, totalResults }) {
  const sortOptions = [
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
    { value: 'most_sold', label: 'Más vendidos' },
    { value: 'createdAt', label: 'Nuevos ingresos' },
  ];

  return (
    <div className="product-sort d-flex justify-content-between align-items-center mb-3">
      <span className="text-muted">
        {totalResults > 0 ? `${totalResults.toLocaleString()} resultados` : 'Sin resultados'}
      </span>
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="sort-select" className="mb-0 text-muted">Ordenar por:</label>
        <select
          id="sort-select"
          className="form-select form-select-sm"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          style={{ width: 'auto' }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProductSort;