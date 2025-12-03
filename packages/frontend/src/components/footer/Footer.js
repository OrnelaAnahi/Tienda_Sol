import React, { useState, useEffect } from "react";
import "./Footer.css";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";


export default function Footer() {
  return (
    <>
      <div className="footer-hover-zone"></div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-social">
            <a href="https://www.facebook.com/MercadoLibre"  className="social-btn"><FaFacebookF size={20} /></a>
            <a href="https://www.linkedin.com/company/mercadolibre/posts/?feedView=all"  className="social-btn"><FaLinkedinIn size={20} /></a>
            <a href="https://www.instagram.com/mercadolibre.arg"  className="social-btn"><FaInstagram size={20} /></a>
            <a href="https://www.youtube.com/user/mercadolibre"  className="social-btn"><FaYoutube size={20} /></a>
          
          </div>
          <p className="footer-text">© 2025 Tienda Sol. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

