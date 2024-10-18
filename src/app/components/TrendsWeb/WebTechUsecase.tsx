import React, { useState, useEffect, useRef } from "react";

const WebCircleThree = () => {
  // Parameters for the larger circles
  const largeRadius = 330; // Radius for positioning the larger circles
  const centerXLarge = -4; // X position for the center of the main large circle
  const centerYLarge = 345; // Y position for the center of the main large circle

  // Parameters for the smaller dots
  const smallDotRadius = 192; // Radius for positioning the smaller dots
  const centerXSmall = -12; // X position for the center of the smaller dots
  const centerYSmall = 350; // Y position for the center of the smaller dots

  const numCircles = 8; // Number of circles/dots around each center

  // State for larger circles and smaller dots
  const [currentAngleLarge, setCurrentAngleLarge] = useState(0);
  const [currentAngleSmall, setCurrentAngleSmall] = useState(0);

  // Track dragging states separately for larger and smaller dots
  const [isDraggingLarge, setIsDraggingLarge] = useState(false);
  const [isDraggingSmall, setIsDraggingSmall] = useState(false);

  // References to start positions when dragging
  const startYLarge = useRef(null);
  const startYSmall = useRef(null);

  const [highlightedIndex, setHighlightedIndex] = useState(0); // Highlight the larger circle

  // Array of names for the large circles
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

  // Array of names for the smaller dots
  const smallDotNames = [
    "Dot 1",
    "Dot 2",
    "Dot 3",
    "Dot 4",
    "Dot 5",
    "Dot 6",
    "Dot 7",
    "Dot 8",
  ];

  // Generate positions for larger circles
  const largeCirclePositions = Array.from({ length: numCircles }, (_, i) => {
    const angle = currentAngleLarge + (i * 2 * Math.PI) / numCircles;
    const x = centerXLarge + largeRadius * Math.cos(angle);
    const y = centerYLarge + largeRadius * Math.sin(angle);
    return { x, y };
  });

  // Generate positions for smaller dots
  const smallDotPositions = Array.from({ length: numCircles }, (_, i) => {
    const angle = currentAngleSmall + (i * 2 * Math.PI) / numCircles;
    const x = centerXSmall + smallDotRadius * Math.cos(angle);
    const y = centerYSmall + smallDotRadius * Math.sin(angle);
    return { x, y };
  });

  // Update highlighted index for larger circles
  const updateHighlightedIndex = () => {
    const topCircleIndex =
      Math.round((currentAngleLarge / (2 * Math.PI)) * numCircles) % numCircles;
    setHighlightedIndex((topCircleIndex + numCircles) % numCircles);
  };

  // Dragging logic for larger circles
  const handleMouseDownLarge = (e) => {
    setIsDraggingLarge(true);
    startYLarge.current = e.clientY;
  };

  const handleMouseMoveLarge = (e) => {
    if (!isDraggingLarge) return;
    const deltaY = e.clientY - startYLarge.current;
    setCurrentAngleLarge((prev) => prev + deltaY * 0.01);
    startYLarge.current = e.clientY;
    updateHighlightedIndex();
  };

  const handleMouseUpLarge = () => {
    setIsDraggingLarge(false);
    updateHighlightedIndex();
  };

  // Dragging logic for smaller dots
  const handleMouseDownSmall = (e) => {
    setIsDraggingSmall(true);
    startYSmall.current = e.clientY;
  };

  const handleMouseMoveSmall = (e) => {
    if (!isDraggingSmall) return;
    const deltaY = e.clientY - startYSmall.current;
    setCurrentAngleSmall((prev) => prev + deltaY * 0.005);
    startYSmall.current = e.clientY;
  };

  const handleMouseUpSmall = () => {
    setIsDraggingSmall(false);
  };

  // Add event listeners for dragging large circles
  useEffect(() => {
    if (isDraggingLarge) {
      window.addEventListener("mousemove", handleMouseMoveLarge);
      window.addEventListener("mouseup", handleMouseUpLarge);
    } else {
      window.removeEventListener("mousemove", handleMouseMoveLarge);
      window.removeEventListener("mouseup", handleMouseUpLarge);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveLarge);
      window.removeEventListener("mouseup", handleMouseMoveLarge);
    };
  }, [isDraggingLarge]);

  // Add event listeners for dragging smaller dots
  useEffect(() => {
    if (isDraggingSmall) {
      window.addEventListener("mousemove", handleMouseMoveSmall);
      window.addEventListener("mouseup", handleMouseUpSmall);
    } else {
      window.removeEventListener("mousemove", handleMouseMoveSmall);
      window.removeEventListener("mouseup", handleMouseUpSmall);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveSmall);
      window.removeEventListener("mouseup", handleMouseUpSmall);
    };
  }, [isDraggingSmall]);

  return (
    <div className="flex items-center w-1/2 relative select-none ">
      {/* Main circle */}
      <img src="/round1.png" alt="" className="h-[250px]" />
      <div className="absolute">
        <img src="innercircle1.png" alt="" className="h-[400px]" />
      </div>
      <div className="absolute left-8">
        <img src="innercircle1.png" alt="" className="h-[650px]" />
      </div>

      {/* Render 8 larger circles with text next to each circle */}
      {largeCirclePositions.map((pos, index) => (
        <div
          key={index}
          className="absolute pointer"
          onMouseDown={handleMouseDownLarge}
          onClick={() => setHighlightedIndex(index)}
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
          ></div>

          <div className="absolute top-1/2 transform -translate-y-1/2 left-full ml-4 text-sm font-medium text-black">
            {circleNames[index]}
          </div>
        </div>
      ))}

      {/* Render 8 smaller dots with text next to each dot */}
      {smallDotPositions.map((pos, index) => (
        <div
          key={`small-dot-${index}`}
          className="absolute"
          onMouseDown={handleMouseDownSmall}
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
          ></div>

          <div className="absolute top-1/2 transform -translate-y-1/2 left-full ml-2 text-xs font-medium text-black w-32">
            {smallDotNames[index]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebCircleThree;
