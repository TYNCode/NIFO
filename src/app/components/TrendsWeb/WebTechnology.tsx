import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import sectorData from "../../data/data_sector.json";

const WebTechnology = ({ selectedSector, onDotClick, selectedIndustry }) => {
  useLayoutEffect(() => {
    const calculateBoundingRect = () => {
      if (innerArcRef.current) {
        setInnerArcRect(innerArcRef.current.getBoundingClientRect());
      }
    };
    calculateBoundingRect();
  }, []);

  const handleImageLoad = () => {
    if (innerArcRef.current) {
      setInnerArcRect(innerArcRef.current.getBoundingClientRect());
    }
  };

  const sectors = sectorData.sectors;

  const getTechnologyData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );
    const selectedIndustryData =
      selectedSectorData?.subSectors[selectedIndustry];

    if (!selectedIndustryData) return [];

    return selectedIndustryData.map((technology) => ({
      sectorName: selectedSectorData.sector,
      industryName: selectedIndustry,
      technologyTrend: technology.technologyTrend,
      useCases: technology.useCases.slice(0, 2),
    }));
  };

  const [outerCircleData, setOuterCircleData] = useState(getTechnologyData());

    useEffect(() => {
      setOuterCircleData(getTechnologyData());
    }, [selectedSector, selectedIndustry]);

  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;
  const [angleOffset, setAngleOffset] = useState(Math.PI / 2);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const innerArcRef = useRef(null);
  const [innerArcRect, setInnerArcRect] = useState(null);

  const radiusX =
    screenWidth >= 1536
      ? 284
      : screenWidth >= 1280
      ? 260
      : screenWidth >= 1024
      ? 224
      : 160;
  const radiusY = radiusX;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);

      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

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
    setIsDragging(true);
    setLastMouseY(event.clientY);
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
      onMouseDown={handleMouseDown}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative inline-block">
        <img
          src="/round2.png"
          alt="Background"
          className="2xl:h-[400px] xl:h-[380px] lg:h-[300px]"
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-x-0 left-8 inset-y-0 flex items-center justify-center text-2xl font-semibold text-gray-700 cursor-pointer z-10">
          TECHNOLOGY
        </div>
      </div>

      <div className="absolute right-12" ref={innerArcRef}>
        <img
          src="innerarc2.svg"
          alt="Inner Circle"
          className="2xl:h-[580px] xl:h-[520px] lg:h-[450px]"
          onLoad={handleImageLoad}
        />
      </div>

      {innerArcRect && 
      dots.map((dot) => {
        const isMiddleDot = dot.index === centerIndex;
        const innerArcRect = innerArcRef.current?.getBoundingClientRect();
        const innerArcCenterX = innerArcRect
          ? innerArcRect.left + innerArcRect.width / 2
          : 0;
        const innerArcCenterY = innerArcRect
          ? innerArcRect.top + innerArcRect.height / 2
          : 0;

        const horizontalOffsetPercent =
          screenWidth >= 1536
            ? -5.76
            : screenWidth >= 1280
            ? -5.36
            : screenWidth >= 1024
            ? -4.94
            : -5.74;
        const verticalOffsetPercent =
          screenWidth >= 1536
            ? -0.1
            : screenWidth >= 1280
            ? -0.1
            : screenWidth >= 1024
            ? -0.125
            : -0.1;
        const horizontalOffset = innerArcRect
          ? innerArcRect.width * horizontalOffsetPercent
          : 0;
        const verticalOffset = innerArcRect
          ? innerArcRect.height * verticalOffsetPercent
          : 0;

        return (
          <div
            key={dot.index}
            className="absolute flex flex-col items-center justify-center cursor-pointer select-none"
            style={{
              right: `${innerArcCenterX + dot.x + horizontalOffset}px`,
              top: `${innerArcCenterY + dot.y + verticalOffset}px`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={() => {
              setIsDragging(true);
              setLastMouseY(null);
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
