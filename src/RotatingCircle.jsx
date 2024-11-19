import React from 'react';


const RotatingCircle = () => {
  const numCircles = 8; // Number of small circles on the border

  return (
    <div className="circle-container">
      <div className="orbit">
        {/* Create small circles dynamically */}
        {Array.from({ length: numCircles }).map((_, index) => (
          <div
            key={index}
            className="small-circle"
            style={{
              transform: `rotate(${(index * 360) / numCircles}deg) translate(0, -120px)`, // Position each circle on the orbit
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingCircle;
