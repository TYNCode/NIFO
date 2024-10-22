import React, { useState, useEffect, useRef } from "react";
import sectorData from "../../data/data_sector.json"; 

const FirstRightCircle = ({ selectedSector, onDotClick }) => {
  const sectors = sectorData.sectors;

  const getInitialSubSectorData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );

    if (!selectedSectorData) return [];
    return Object.keys(selectedSectorData.subSectors).map((subSectorName) => ({
      subSectorName,
      technologyTrends: selectedSectorData.subSectors[subSectorName],
    }));
  };

  const [outerCircleData, setOuterCircleData] = useState(
    getInitialSubSectorData()
  );
  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;
  const [angleOffset, setAngleOffset] = useState(Math.PI / 2);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const circleRef = useRef(null);

  const radiusX = 327;
  const radiusY = 320;

  useEffect(() => {
    setOuterCircleData(getInitialSubSectorData());
  }, [selectedSector]);

  const handleMouseMoveHandler = (event) => {
    const { clientY } = event;
    if (lastMouseY !== null) {
      const deltaY = clientY - lastMouseY;
      const rotationSpeed = 0.005;
      setAngleOffset((prevOffset) => prevOffset - deltaY * rotationSpeed);
    }
    setLastMouseY(clientY);
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
      className="flex items-center justify-end h-screen w-1/2 relative"
      ref={circleRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={(e) => isDragging && handleMouseMoveHandler(e)}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative inline-block">
        <img src="/round2.png" alt="Background" className="h-[450px]" />
        <div
          className="absolute inset-x-0 left-8 inset-y-0 flex items-center justify-center text-2xl font-semibold text-gray-700 cursor-pointer z-10"
        >
          INDUSTRY
        </div>
      </div>
      <div className="absolute right-8">
        <img
          src="innercircle2.png"
          alt="Inner Circle"
          className="h-[650px] w-80"
        />
      </div>
      {dots.map((dot) => {
        const isMiddleDot = dot.index === centerIndex;

        return (
          <div
            key={dot.index}
            className="absolute flex flex-col items-center justify-center cursor-pointer"
            style={{
              right: `${dot.x}px`,
              top: `${dot.y + 346}px`,
              userSelect: "none",
            }}
            onClick={() => handleDotClick(dot.index)}
          >
            <div
              className={`flex flex-row-reverse items-center justify-center ${
                isMiddleDot ? "border-blue-500" : "border-black"
              }`}
              style={{ textAlign: "center" }}
            >
              <div
                className={`rounded-full flex items-center justify-center ${
                  isMiddleDot
                    ? "bg-[#3AB8FF] border-[#FFEFA7] border-2"
                    : "bg-[#D8D8D8]"
                }  ${isMiddleDot ? "w-10 h-10" : "w-8 h-8"}`}
                style={{ flexShrink: 0 }}
              ></div>
              <div
                className={`text-sm w-32 ml-2 ${
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

export default FirstRightCircle;
