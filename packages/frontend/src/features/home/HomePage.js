import React from "react";
import PromotionalCarousel from "../../components/carrousel/PromotionalCarousel.js";
import TrendingCarousel from "../../components/carrousel/TrendingCarousel.js";
import NewArrivalsCarousel from "../../components/carrousel/NewArrivalsCarousel.js";

const Home = () => {
    return (
      <div>
        <PromotionalCarousel />
        <TrendingCarousel />
        <NewArrivalsCarousel/>
      </div>
    );
};

export default Home;