import React from 'react';
import './Basket.css';

const Basket = ({ position }) => {
  return (
    <div 
      className="basket"
      style={{ left: `${position}%` }}
    >
      <div className="basket-body">
        <div className="basket-rim"></div>
        <div className="basket-pattern"></div>
      </div>
      <div className="basket-handle"></div>
      <div className="basket-shadow"></div>
    </div>
  );
};

export default Basket;
