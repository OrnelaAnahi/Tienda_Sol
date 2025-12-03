import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/CartContext';
import Header from './components/header/Header';
import Cart from './components/cart/Cart';
import Footer from './components/footer/Footer';
import AppRoutes from './AppRoutes';

function App() {
  return(
    <CartProvider>
      <BrowserRouter>
        <Header />
        <Cart />
        <AppRoutes/>
        <Footer/>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;
