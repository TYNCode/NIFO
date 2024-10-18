import React, { useState, useEffect, useRef } from "react";

const WebTechnology = ({ onDotClick }) => {
  const radius = 315;
  const centerX = 1515;
  const centerY = 338;
  const numCircles = 8;

  const [currentAngle, setCurrentAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(null);
  const [highlightedIndex, setHighlightedIndex] = useState(4);

  const circleNames = [
    "Sector 1",
    "Sector 2",
    "Sector 3",
    "Sector 4",
    "Sector 5",
    "Sector 6",
    "Sector 7",
    "Sector 8",
  ];

  const circlePositions = Array.from({ length: numCircles }, (_, i) => {
    const angle = currentAngle + (i * 2 * Math.PI) / numCircles;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });

  const findTopIndex = () => {
    const normalizedAngle =
      ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const sectorAngle = (2 * Math.PI) / numCircles;
    const topIndex = Math.round(normalizedAngle / sectorAngle) % numCircles;
    setHighlightedIndex((numCircles - topIndex) % numCircles);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startY.current = e.clientY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY.current;
    setCurrentAngle((prev) => prev - deltaY * 0.01);
    startY.current = e.clientY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    findTopIndex();
  };

  const handleClick = (index) => {
    const targetAngle =
      (highlightedIndex - index) * ((2 * Math.PI) / numCircles);
    setCurrentAngle((prev) => prev + targetAngle);
    setHighlightedIndex(index);

    if (index === highlightedIndex) {
      onDotClick(); // Trigger the click event to show WebCircleThree
    }
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

  useEffect(() => {
    findTopIndex();
  }, [currentAngle]);

  return (
    <div
      className="flex items-center justify-end h-screen w-1/2 overflow-x-hidden"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <img src="/round2.png" alt="Background" className="h-[450px]" />
      <div className="absolute right-0">
        <img
          src="/innercircle2.png"
          alt="Inner Circle"
          className="h-[650px] w-80"
        />
      </div>
      {circlePositions.map((pos, index) => (
        <div
          key={index}
          className="absolute pointer"
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
          <div className="absolute top-1/2 transform -translate-y-1/2 right-full text-right mr-4 text-sm font-medium text-black w-32">
            {circleNames[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebTechnology;
