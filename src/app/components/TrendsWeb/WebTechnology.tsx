import React, { useState, useEffect, useRef } from "react";
import sectorData from "../../data/data_sector.json";

const WebTechnology = ({ selectedSector, onDotClick, selectedIndustry }) => {
  const sectors = sectorData.sectors;

  const getInitialTechnologyData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );
    const selectedIndustryData =
      selectedSectorData?.subSectors[selectedIndustry];

    if (!selectedIndustryData) return [];

    return selectedIndustryData.slice(0, 8).map((technology) => ({
      sectorName: selectedSectorData.sector,
      industryName: selectedIndustry,
      technologyTrend: technology.technologyTrend,
      useCases: technology.useCases.slice(0, 2),
    }));
  };

  const [outerCircleData, setOuterCircleData] = useState(
    getInitialTechnologyData()
  );
  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;
  const [angleOffset, setAngleOffset] = useState(Math.PI / 2);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // Track screen width
  const circleRef = useRef(null);

  const radiusX =
    screenWidth >= 1536
      ? 280
      : screenWidth >= 1280
      ? 260
      : screenWidth >= 1024
      ? 222
      : 160;
  const radiusY = radiusX;

  useEffect(() => {
    setOuterCircleData(getInitialTechnologyData());
  }, [selectedSector, selectedIndustry]);

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

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize); // Listen for window resizing

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize); // Clean up listener
    };
  }, [isDragging]);

  const handleMouseMoveHandler = (event) => {
    const { clientY } = event;
    if (lastMouseY !== null) {
      const deltaY = clientY - lastMouseY;
      const rotationSpeed = 0.0003;
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
      onDotClick(outerCircleData[dotIndex].technologyTrend);
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
      className="flex items-center justify-end h-[calc(100vh-64px)] w-1/2 relative"
      ref={circleRef}
      onMouseDown={handleMouseDown}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative inline-block">
        <img
          src="/round2.png"
          alt="Background"
          className="2xl:h-[400px] xl:h-[380px] lg:h-[300px]"
        />
        <div className="absolute inset-x-0 left-8 inset-y-0 flex items-center justify-center text-2xl font-semibold text-gray-700 cursor-pointer z-10">
          TECHNOLOGY
        </div>
      </div>

      <div className="absolute right-12">
        <img
          src="innercircle2.png"
          alt="Inner Circle"
          className="2xl:h-[580px] xl:h-[520px] lg:h-[450px]"
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
              top: `${
                dot.y +
                (screenWidth >= 1536
                  ? 315
                  : screenWidth >= 1280
                  ? 352
                  : screenWidth >= 1024
                  ? 250
                  : 240)
              }px`,
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
                } ${isMiddleDot ? "w-10 h-10" : "w-8 h-8"}`}
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
                {outerCircleData[dot.index]?.technologyTrend || "N/A"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebTechnology;
