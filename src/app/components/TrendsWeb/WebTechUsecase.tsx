import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import sectorData from "../../data/data_sector.json";

const WebTechUsecase = ({
  selectedSector,
  selectedIndustry: propSelectedIndustry,
  handleGoSector,
  onTechnologyClick,
  selectedTechnology,
}) => {
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
  const [selectedIndustry, setSelectedIndustry] = useState(propSelectedIndustry);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [outerCircleData, setOuterCircleData] = useState([]);
  const innerArcRef = useRef(null);
  const [innerArcRect, setInnerArcRect] = useState(null);

  const radiusXOuter =
    screenWidth >= 1536 ? 310 : screenWidth >= 1280 ? 310 : screenWidth >= 1024 ? 225 : 180;
  const radiusYOuter = radiusXOuter;

  const [isDraggingOuter, setIsDraggingOuter] = useState(false);
  const [lastMouseYOuter, setLastMouseYOuter] = useState(null);

  useLayoutEffect(() => {
    if (innerArcRef.current) {
      setInnerArcRect(innerArcRef.current.getBoundingClientRect());
    }
  }, [screenWidth]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const selectedSectorData = sectors.find((sector) => sector.sector === selectedSector);
    const selectedIndustryData = selectedSectorData?.subSectors[selectedIndustry];
    if (selectedIndustryData) {
      setOuterCircleData(
        selectedIndustryData.slice(0, 8).map((technology) => ({
          technologyTrend: technology.technologyTrend,
        }))
      );
    }
  }, [selectedSector, selectedIndustry]);

  const totalOuterDots = outerCircleData.length;
  const anglePerOuterDot = (2 * Math.PI) / totalOuterDots;
  const [angleOffsetOuter, setAngleOffsetOuter] = useState(Math.PI / 2);

  useEffect(() => {
    const selectedTechnologyIndex = outerCircleData.findIndex(
      (tech) => tech.technologyTrend === selectedTechnology
    );

    if (selectedTechnologyIndex >= 0) {
      setAngleOffsetOuter(Math.PI / 2 - selectedTechnologyIndex * anglePerOuterDot);
    }
  }, [selectedTechnology, outerCircleData]);

  const handleDotClickOuter = (dotIndex) => {
    const normalizedAngleOuterOffset =
      ((angleOffsetOuter % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentOuterCenterIndex = Math.round(
      ((Math.PI / 2 - normalizedAngleOuterOffset) / anglePerOuterDot + totalOuterDots) %
        totalOuterDots
    );
    const outerDistance = (dotIndex - currentOuterCenterIndex + totalOuterDots) % totalOuterDots;
    const shortestOuterDistance = outerDistance <= totalOuterDots / 2 ? outerDistance : outerDistance - totalOuterDots;
    const outerAngleDifference = shortestOuterDistance * anglePerOuterDot;
    setAngleOffsetOuter((prevOffset) => prevOffset - outerAngleDifference);

    onTechnologyClick(outerCircleData[dotIndex].technologyTrend);
  };

  const dotsOuter = Array.from({ length: totalOuterDots }).map((_, index) => {
    const outerAngle = (index / totalOuterDots) * Math.PI * 2 + angleOffsetOuter;
    const x = radiusXOuter * Math.sin(outerAngle);
    const y = radiusYOuter * Math.cos(outerAngle);
    return { x, y, index };
  });

  const handleMouseMoveHandlerOuter = (event) => {
    const { clientY } = event;
    if (lastMouseYOuter !== null) {
      const deltaY = clientY - lastMouseYOuter;
      const rotationSpeed = 0.005;
      setAngleOffsetOuter((prevOffset) => prevOffset - deltaY * rotationSpeed);
    }
    setLastMouseYOuter(clientY);
  };

  const handleMouseDownOuter = (event) => {
    setIsDraggingOuter(true);
    setLastMouseYOuter(event.clientY);
  };

  const handleMouseUpOuter = () => {
    setIsDraggingOuter(false);
    setLastMouseYOuter(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingOuter) handleMouseMoveHandlerOuter(e);
    };
    const handleMouseUp = () => handleMouseUpOuter();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingOuter, lastMouseYOuter]);

  const horizontalOffsetOuterPercent = screenWidth >= 1536 ? -0.2 : screenWidth >= 1280 ? -0.12 : screenWidth >= 1024 ? 0.1 : -0.2;
  const verticalOffsetOuterPercent = screenWidth >= 1536 ? -0.19 : screenWidth >= 1280 ? -0.18 : screenWidth >= 1024 ? -0.27 : -0.27;
  const horizontalOffsetInnerPercent = screenWidth >= 1536 ? 1.25 : screenWidth >= 1280 ? 1.25 : screenWidth >= 1024 ? 1.35 : 1.25;
  const verticalOffsetInnerPercent = screenWidth >= 1536 ? 0.31 : screenWidth >= 1280 ? 0.32 : screenWidth >= 1024 ? 0.27 : -0;

  return (
    <div className="flex items-center justify-start h-[calc(100vh-64px)] w-1/2 relative" onMouseDown={handleMouseDownOuter} onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <img src="/round1.png" alt="Background" className="2xl:h-[216px] xl:h-[256px] lg:h-[180px]" onLoad={handleImageLoad} />
        <div className="absolute inset-0 left-2 right-2 flex items-center justify-center">
          <div className="text-sm font-semibold text-gray-700 cursor-pointer z-10" onClick={handleGoSector}>
            {selectedSector}
          </div>
        </div>
      </div>
      <div className="absolute left-8" ref={innerArcRef}>
        <img src="innerarc1.svg" alt="Inner Circle Large" className="2xl:h-[620px] xl:h-[650px] lg:h-[470px]" onLoad={handleImageLoad} />
      </div>
      <div className="absolute left-8" ref={innerArcRef}>
        <img src="innerarc1.svg" alt="Inner Circle Small" className="2xl:h-[320px] xl:h-[350px] lg:h-[230px]" onLoad={handleImageLoad} />
      </div>
      {innerArcRect &&
        dotsOuter.map((dot) => {
          const isMiddleDotOuter =
            dot.index === Math.round(((Math.PI / 2 - angleOffsetOuter) / anglePerOuterDot + totalOuterDots) % totalOuterDots);
          const innerArcCenterX = innerArcRect.left + innerArcRect.width / 2;
          const innerArcCenterY = innerArcRect.top + innerArcRect.height / 2;

          const horizontalOffsetOuter = innerArcRect.width * horizontalOffsetOuterPercent;
          const verticalOffsetOuter = innerArcRect.height * verticalOffsetOuterPercent;

          return (
            <div
              key={`outer-${dot.index}`}
              className="absolute flex flex-row gap-2 items-center justify-center cursor-pointer"
              onClick={() => handleDotClickOuter(dot.index)}
              style={{
                left: `${innerArcCenterX + dot.x + horizontalOffsetOuter}px`,
                top: `${innerArcCenterY + dot.y + verticalOffsetOuter}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className={`rounded-full ${isMiddleDotOuter ? "bg-[#3AB8FF] border-[#FFEFA7] border-2" : "bg-[#D8D8D8]"}`} style={{ width: isMiddleDotOuter ? "40px" : "32px", height: isMiddleDotOuter ? "40px" : "32px" }} />
              <div className={`text-sm w-32 ${isMiddleDotOuter ? "font-semibold text-base text-[#4C4C4C]" : "text-[#797979]"}`} style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                {outerCircleData[dot.index]?.technologyTrend || "N/A"}
              </div>
            </div>
          );
        })}
      {innerArcRect && (
        <div
          className="absolute"
          style={{
            left: `${innerArcRect.left + innerArcRect.width * horizontalOffsetInnerPercent}px`,
            top: `${innerArcRect.top + innerArcRect.height * verticalOffsetInnerPercent}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex flex-row items-center justify-center">
            <div className="rounded-full bg-[#3AB8FF] border-[#FFEFA7] border-2" style={{ width: "26px", height: "26px" }}></div>
            <div className="text-[14px] text-[#4C4C4C] font-semibold w-20 text-left " style={{ textAlign: "center", marginTop: "8px" }}>
              {selectedIndustry || "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebTechUsecase;
