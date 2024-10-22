import React, { useState, useEffect, useRef } from "react";
import sectorData from "../../data/data_sector.json";

const WebSubIndustries = ({ selectedSector, selectedIndustry, onDotClick, handleGoSector }) => {
  const sectors = sectorData.sectors;

  const getInitialSubSectorData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );
    return selectedSectorData
      ? Object.keys(selectedSectorData.subSectors).map((subSectorName) => ({
          subSectorName,
          technologies: selectedSectorData.subSectors[subSectorName] || [],
        }))
      : [];
  };

  const [outerCircleData, setOuterCircleData] = useState(
    getInitialSubSectorData()
  );
  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;

  const selectedIndustryIndex = outerCircleData.findIndex(
    (data) => data.subSectorName === selectedIndustry
  );

  const [angleOffset, setAngleOffset] = useState(
    Math.PI / 2 - selectedIndustryIndex * anglePerDot
  );

  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const circleRef = useRef(null);

  const radiusX = 290;
  const radiusY = 290;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        handleMouseMoveHandler(event);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setLastMouseY(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, lastMouseY]);

  const handleMouseMoveHandler = (event) => {
    const { clientY } = event;
    if (lastMouseY !== null) {
      const deltaY = clientY - lastMouseY;
      const rotationSpeed = 0.005;
      setAngleOffset((prevOffset) => prevOffset - deltaY * rotationSpeed);
    }
    setLastMouseY(clientY);
  };

  const handleMouseDown = (event) => {
    if (circleRef.current && circleRef.current.contains(event.target)) {
      setIsDragging(true);
      setLastMouseY(event.clientY);
    }
  };

const handleDotClick = (dotIndex) => {
  const normalizedAngleOffset =
    ((angleOffset % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  const currentCenterIndex = Math.round(
    ((Math.PI / 2 - normalizedAngleOffset) / anglePerDot + totalDots) %
      totalDots
  );

  const distance = (dotIndex - currentCenterIndex + totalDots) % totalDots;
  const shortestDistance =
    distance <= totalDots / 2 ? distance : distance - totalDots;
  const angleDifference = shortestDistance * anglePerDot;

  setAngleOffset((prevOffset) => prevOffset - angleDifference);

  if (onDotClick) {
    onDotClick(outerCircleData[dotIndex].subSectorName); 
  }
};


  const dots = Array.from({ length: totalDots }).map((_, index) => {
    const angle = (index / totalDots) * Math.PI * 2 + angleOffset;
    const x = radiusX * Math.sin(angle);
    const y = radiusY * Math.cos(angle);
    return { x, y, index };
  });

  const centerIndex = Math.round(
    ((Math.PI / 2 - angleOffset) / anglePerDot + totalDots) % totalDots
  );

  return (
    <div
      className="flex items-center justify-start h-[calc(100vh-64px)] w-1/2 relative"
      ref={circleRef}
      onMouseDown={handleMouseDown}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative inline-block">
        <img src="/round1.png" alt="Background" className="h-[400px]" />
        <div className="absolute inset-0  left-6 flex items-center justify-center">
          <div
            className="text-lg font-semibold text-gray-700 cursor-pointer z-10"
            onClick={handleGoSector}
          >
            {selectedSector}
          </div>
        </div>
      </div>

      <div className="absolute left-8">
        <img
          src="innercircle1.png"
          alt="Inner Circle"
          className="h-[580px]"
        />
      </div>

      {dots.map((dot) => {
        const isMiddleDot = dot.index === centerIndex;

        return (
          <div
            key={dot.index}
            className="absolute flex flex-col items-center justify-center cursor-pointer"
            style={{
              left: `${dot.x}px`,
              top: `${dot.y + 320}px`,
              userSelect: "none",
            }}
            onMouseDown={() => {
              setIsDragging(true);
              setLastMouseY(null);
            }}
            onClick={() => handleDotClick(dot.index)}
          >
            <div
              className={`flex flex-row items-center justify-center ${
                isMiddleDot ? "border-blue-500" : "border-black"
              }`}
              style={{ textAlign: "center" }}
            >
              <div
                className={`rounded-full flex items-center justify-center ${
                  isMiddleDot
                    ? "bg-[#3AB8FF] border-[#FFEFA7] border-2"
                    : "bg-[#D8D8D8]"
                } ${isMiddleDot ? "w-10 h-10" : "w-8 h-8"}`}
                style={{ flexShrink: 0 }}
              ></div>
              <div
                className={`text-sm w-32 ${
                  isMiddleDot
                    ? "font-semibold text-base text-[#4C4C4C]"
                    : "text-[#797979]"
                }`}
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
              >
                {outerCircleData[dot.index].subSectorName || "N/A"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebSubIndustries;
