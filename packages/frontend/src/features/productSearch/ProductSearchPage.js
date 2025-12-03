import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductSearchPage.css';
import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../../components/filters/Filters';
import ProductSort from '../../components/filters/ProductSort';
import ProductCard from '../../components/productCard/ProductCard';
import { obtenerProductosSearch } from '../../api/axiosClient';

function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCurrentFilters = () => ({
    nombre: searchParams.get('q') || '', 
    categoria: searchParams.get('categoria') || '',
    descripcion: searchParams.get('descripcion') || '',
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || '',
    sort: searchParams.get('sort') || 'price_asc',
    page: searchParams.get('page') || '1',
    size: searchParams.get('size') || '10'
  });

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = getCurrentFilters();
      const queryString = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value)
      ).toString();

      const response = await obtenerProductosSearch(queryString);
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      setProductos(data.data || []);
      setPagination(data.pagination);
      data.data.forEach(producto => {
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [searchParams]);

  const handleFiltersChange = (newFilters) => {
    const currentFilters = getCurrentFilters();
    
    const searchTerm = searchParams.get('q');
    
    const updatedParams = {
      ...newFilters,
      page: '1' 
    };

    if (searchTerm) {
      updatedParams.q = searchTerm;
    }

    if (!updatedParams.sort) {
      updatedParams.sort = currentFilters.sort;
    }

    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key]) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  const handleSortChange = (newSort) => {
    const currentFilters = getCurrentFilters();
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sort: newSort,
      page: '1'
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: newPage.toString()
    });
  };

  const activeFilters = getCurrentFilters();
  const searchTerm = searchParams.get('q');

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-4 flex-grow-1">
        {searchTerm && (
          <div className="mb-3">
            <h5 className="text-muted">
              Resultados para: <strong>{searchTerm}</strong>
            </h5>
          </div>
        )}

        <div className="row">
          <div className="col-lg-3 col-md-4">

            <div className="mb-3">
              <label htmlFor="size-select" className="form-label">Mostrar por página</label>
              <select
                id="size-select"
                className="form-select"
                value={activeFilters.size}
                onChange={(e) => {
                  const newSize = e.target.value || '10';
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    size: newSize,
                    page: '1'
                  });
                }}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>

            <ProductFilters 
              onFilterChange={handleFiltersChange}
              activeFilters={activeFilters}
            />
          </div>

          <div className="col-lg-9 col-md-8">
            <ProductSort 
              currentSort={activeFilters.sort}
              onSortChange={handleSortChange}
              totalResults={pagination?.totalItems || 0}
            />

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                {productos.length > 0 ? (
                  <div className="products-grid">
                    {productos.map((producto) => (
                      <ProductCard
                        key={producto.id}
                        producto={producto}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No se encontraron productos con los filtros seleccionados.
                  </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                  <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${!pagination.hasPrevPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrevPage}
                        >
                          Anterior
                        </button>
                      </li>
                      <li className="page-item active">
                        <span className="page-link">
                          {pagination.currentPage} de {pagination.totalPages}
                        </span>
                      </li>
                      <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSearchPage;