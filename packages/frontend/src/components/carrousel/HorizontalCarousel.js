import React, { useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "./HorizontalCarousel.css";

export default function HorizontalCarousel({ 
  items = [], 
  renderCard,
  className = "" 
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(updateScrollButtons, 300);
  };

  if (!items || items.length === 0) {
    return (
      <div className="horizontal-carousel-empty">
        <p>No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={`horizontal-carousel ${className}`}>
      {canScrollLeft && (
        <button
          className="horizontal-carousel-btn horizontal-carousel-btn-left"
          onClick={() => scroll('left')}
          aria-label="Anterior"
        >
          <IoChevronBack size={24} />
        </button>
      )}

      <div 
        className="horizontal-carousel-container"
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
      >
        {items.map((item, index) => (
          <div key={item.id || index} className="horizontal-carousel-item">
            {renderCard(item, index)}
          </div>
        ))}
      </div>

      {canScrollRight && (
        <button
          className="horizontal-carousel-btn horizontal-carousel-btn-right"
          onClick={() => scroll('right')}
          aria-label="Siguiente"
        >
          <IoChevronForward size={24} />
        </button>
      )}
    </div>
  );
}