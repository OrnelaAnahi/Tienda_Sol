import React from "react";
import Carousel from "./Carousel.js";
import "./PromotionalCarousel.css";

export default function PromotionalCarousel() {
  const imagenes = [
    {
      src: "/images/imagenesPromocionales/promo1.jpg",
      alt: "Promoción 1",
      title: "Hasta 40% OFF"
    },
    {
      src: "/images/imagenesPromocionales/promo2.jpg",
      alt: "Promoción 2",
      title: "Envío Gratis"
    },
    {
      src: "/images/imagenesPromocionales/promo3.jpg",
      alt: "Promoción 3",
      title: "Nuevos Productos"
    }
  ];

  const renderPromotionalSlide = (image) => (
    <>
      <img
        src={image.src}
        alt={image.alt}
        className="promotional-carousel-image"
      />
      <div className="promotional-carousel-text">
        <h2>{image.title}</h2>
      </div>
    </>
  );

  return (
    <Carousel
      items={imagenes}
      renderSlide={renderPromotionalSlide}
      autoPlayInterval={5000}
      showControls={true}
      showDots={true}
      className="promotional-carousel"
    />
  );
}