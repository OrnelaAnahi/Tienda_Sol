import { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "./Carousel.css";

export default function Carousel({ 
  items = [],
  renderSlide, 
  autoPlayInterval = 5000,
  showControls = true,
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlayInterval || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!items || items.length === 0) {
    return (
      <div className="carousel-empty">
        <p>No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={`carousel ${className}`}>
      <div className="carousel-slide">
        {renderSlide(items[currentIndex], currentIndex)}
      </div>

      {showControls && items.length > 1 && (
        <>
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={goToPrevious}
            aria-label="Anterior"
          >
            <IoChevronBack size={20} />
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={goToNext}
            aria-label="Siguiente"
          >
            <IoChevronForward size={20} />
          </button>
        </>
      )}
    </div>
  );
}