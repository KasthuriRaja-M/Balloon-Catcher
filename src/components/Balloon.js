import React, { useEffect, useRef } from 'react';
import './Balloon.css';

const Balloon = ({ id, x, y, color, points, onCatch }) => {
  const balloonRef = useRef(null);

  useEffect(() => {
    const balloon = balloonRef.current;
    if (balloon) {
      balloon.style.left = `${x}%`;
      balloon.style.bottom = `${y}%`;
    }
  }, [x, y]);

  const handleClick = () => {
    onCatch(id);
  };

  const getPointsColor = () => {
    switch (points) {
      case 1: return '#4ECDC4';
      case 2: return '#45B7D1';
      case 3: return '#96CEB4';
      default: return '#FFEAA7';
    }
  };

  return (
    <div
      ref={balloonRef}
      className="balloon"
      style={{ '--balloon-color': color }}
      onClick={handleClick}
    >
      <div className="balloon-body">
        <div className="balloon-shine"></div>
      </div>
      <div className="balloon-string"></div>
      <div className="balloon-knot"></div>
      <div 
        className="points-indicator"
        style={{ backgroundColor: getPointsColor() }}
      >
        {points}
      </div>
    </div>
  );
};

export default Balloon;
