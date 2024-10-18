import React, { useState, useEffect } from "react";
import sectorsData from "../../data/sector_data.json"; 

const WebSectors = ({ onDotClick }) => {
  const radius = 326;
  const centerX = 2;
  const centerY = 348;
  const numCircles = 8;

  const [isDragging, setIsDragging] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(4);
  const [angleOffset, setAngleOffset] = useState(0); 

  const circleNames = sectorsData.sectors
    .map((sector) => sector.sectorName)
    .slice(0, numCircles);

  const circlePositions = Array.from({ length: numCircles }, (_, i) => {
    const angle = (i * 2 * Math.PI) / numCircles + angleOffset;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });

  const updateHighlightedIndex = (yPosition) => {
    const relativeY = yPosition - centerY;
    const normalizedAngle = Math.atan2(relativeY, radius);
    const adjustedAngle = normalizedAngle - angleOffset;
    const closestIndex = Math.floor(
      ((adjustedAngle + Math.PI) / (2 * Math.PI)) * numCircles
    );
    setHighlightedIndex((closestIndex + numCircles) % numCircles);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateHighlightedIndex(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.movementY;
    const rotationSpeed = 0.01;
    setAngleOffset((prevAngle) => prevAngle + deltaY * rotationSpeed);
    updateHighlightedIndex(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (index) => {
    const selectedSector = circleNames[index]; 
    onDotClick(selectedSector); 
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="flex items-center justify-start h-screen w-1/2 relative"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <img src="/round1.png" alt="Background" className="h-[450px]" />

      <div className="absolute left-8">
        <img
          src="innercircle1.png"
          alt="Inner Circle"
          className="h-[650px] w-80"
        />
      </div>

      {circlePositions.map((pos, index) => (
        <div
          key={index}
          className="absolute"
          onClick={() => handleClick(index)} 
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            cursor: "pointer",
          }}
        >
          <div
            className={`rounded-full transition-all duration-200 ease-in-out ${
              index === highlightedIndex
                ? "bg-[#3AB8FF] border-[#FFEFA7] border-2 w-10 h-10"
                : "bg-[#D8D8D8] w-8 h-8"
            } relative`}
          />
          <div className="absolute top-1/2 transform -translate-y-1/2 left-full ml-4 text-sm font-medium text-black w-40">
            {circleNames[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebSectors;
