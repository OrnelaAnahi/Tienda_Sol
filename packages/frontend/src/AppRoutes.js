import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './features/home/HomePage';
import ProductSearchPage from './features/productSearch/ProductSearchPage';
import ProductDetail from './features/productDetail/ProductDetail';
import Checkout from './features/checkout/Checkout';
import Orders from './features/orders/Orders';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<ProductSearchPage />} />
      <Route path="/productos/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
}
