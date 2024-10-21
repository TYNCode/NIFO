import React, { useState, useEffect, useRef } from "react";
import sectorData from "../../data/sector_data.json";

const WebTechUsecase = ({ selectedSector, selectedIndustry }) => {
  const sectors = sectorData.sectors;

  const getInitialTechnologyData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sectorName === selectedSector
    );
    const selectedIndustryData = selectedSectorData?.industries.find(
      (industry) => industry.industryName === selectedIndustry
    );

    return selectedIndustryData
      ? selectedIndustryData.technologies.slice(0, 8).map((technology) => ({
          sectorName: selectedSectorData.sectorName,
          industryName: selectedIndustryData.industryName,
          technologyName: technology.technologyName,
        }))
      : [];
  };

  const getInitialIndustryData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sectorName === selectedSector
    );
    return selectedSectorData
      ? selectedSectorData.industries.slice(0, 8).map((industry) => ({
          sectorName: selectedSectorData.sectorName,
          industryName: industry.industryName,
          technologies: industry.technologies || [],
        }))
      : [];
  };

  const [outerCircleData, setOuterCircleData] = useState(
    getInitialTechnologyData()
  );
  const [innerCircleData, setInnerCircleData] = useState(
    getInitialIndustryData()
  );
  const totalOuterDots = outerCircleData.length;
  const totalInnerDots = innerCircleData.length;
  const anglePerOuterDot = (2 * Math.PI) / totalOuterDots;
  const anglePerInnerDot = (2 * Math.PI) / totalInnerDots;

  const [angleOffsetOuter, setAngleOffsetOuter] = useState(Math.PI / 2);
  const [isDraggingOuter, setIsDraggingOuter] = useState(false);
  const [lastMouseYOuter, setLastMouseYOuter] = useState(null);

  const [angleOffsetInner, setAngleOffsetInner] = useState(Math.PI / 2);
  const [isDraggingInner, setIsDraggingInner] = useState(false);
  const [lastMouseYInner, setLastMouseYInner] = useState(null);

  const circleRefOuter = useRef(null);
  const circleRefInner = useRef(null);
  const radiusXOuter = 330;
  const radiusYOuter = 330;
  const radiusXInner = 200;
  const radiusYInner = 220;

  useEffect(() => {
    const handleMouseMoveOuter = (event) => {
      if (isDraggingOuter) {
        handleMouseMoveHandlerOuter(event);
      }
    };

    const handleMouseMoveInner = (event) => {
      if (isDraggingInner) {
        handleMouseMoveHandlerInner(event);
      }
    };

    const handleMouseUpOuter = () => {
      setIsDraggingOuter(false);
      setLastMouseYOuter(null);
    };

    const handleMouseUpInner = () => {
      setIsDraggingInner(false);
      setLastMouseYInner(null);
    };

    window.addEventListener("mousemove", handleMouseMoveOuter);
    window.addEventListener("mousemove", handleMouseMoveInner);
    window.addEventListener("mouseup", handleMouseUpOuter);
    window.addEventListener("mouseup", handleMouseUpInner);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveOuter);
      window.removeEventListener("mousemove", handleMouseMoveInner);
      window.removeEventListener("mouseup", handleMouseUpOuter);
      window.removeEventListener("mouseup", handleMouseUpInner);
    };
  }, [isDraggingOuter, isDraggingInner, lastMouseYOuter, lastMouseYInner]);

  const handleMouseMoveHandlerOuter = (event) => {
    const { clientY } = event;
    if (lastMouseYOuter !== null) {
      const deltaY = clientY - lastMouseYOuter;
      const rotationSpeed = 0.005;
      setAngleOffsetOuter((prevOffset) => prevOffset - deltaY * rotationSpeed);
    }
    setLastMouseYOuter(clientY);
  };

  const handleMouseMoveHandlerInner = (event) => {
    const { clientY } = event;
    if (lastMouseYInner !== null) {
      const deltaY = clientY - lastMouseYInner;
      const rotationSpeed = 0.005;
      setAngleOffsetInner((prevOffset) => prevOffset - deltaY * rotationSpeed);
    }
    setLastMouseYInner(clientY);
  };

  const handleMouseDownOuter = (event) => {
    if (
      circleRefOuter.current &&
      circleRefOuter.current.contains(event.target)
    ) {
      setIsDraggingOuter(true);
      setLastMouseYOuter(event.clientY);
    }
  };

  const handleMouseDownInner = (event) => {
    if (
      circleRefInner.current &&
      circleRefInner.current.contains(event.target)
    ) {
      setIsDraggingInner(true);
      setLastMouseYInner(event.clientY);
    }
  };

  const handleDotClickOuter = (dotIndex) => {
    const normalizedAngleOuterOffset =
      ((angleOffsetOuter % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentOuterCenterIndex = Math.round(
      ((Math.PI / 2 - normalizedAngleOuterOffset) / anglePerOuterDot +
        totalOuterDots) %
        totalOuterDots
    );
    const outerDistance =
      (dotIndex - currentOuterCenterIndex + totalOuterDots) % totalOuterDots;
    const shortestOuterDistance =
      outerDistance <= totalOuterDots / 2
        ? outerDistance
        : outerDistance - totalOuterDots;
    const outerAngleDifference = shortestOuterDistance * anglePerOuterDot;
    setAngleOffsetOuter((prevOffset) => prevOffset - outerAngleDifference);
  };

  const handleDotClickInner = (dotIndex) => {
    const normalizedAngleInnerOffset =
      ((angleOffsetInner % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentInnerCenterIndex = Math.round(
      ((Math.PI / 2 - normalizedAngleInnerOffset) / anglePerInnerDot +
        totalInnerDots) %
        totalInnerDots
    );
    const innerDistance =
      (dotIndex - currentInnerCenterIndex + totalInnerDots) % totalInnerDots;
    const shortestInnerDistance =
      innerDistance <= totalInnerDots / 2
        ? innerDistance
        : innerDistance - totalInnerDots;
    const innerAngleDifference = shortestInnerDistance * anglePerInnerDot;
    setAngleOffsetInner((prevOffset) => prevOffset - innerAngleDifference);
  };

  // Rendering dots for both outer and inner circles
  const dotsOuter = Array.from({ length: totalOuterDots }).map((_, index) => {
    const outerAngle =
      (index / totalOuterDots) * Math.PI * 2 + angleOffsetOuter;
    const x = radiusXOuter * Math.sin(outerAngle);
    const y = radiusYOuter * Math.cos(outerAngle);
    return { x, y, index };
  });

  const dotsInner = Array.from({ length: totalInnerDots }).map((_, index) => {
    const innerAngle =
      (index / totalInnerDots) * Math.PI * 2 + angleOffsetInner;
    const x = radiusXInner * Math.sin(innerAngle);
    const y = radiusYInner * Math.cos(innerAngle);
    return { x, y, index };
  });

  const centerIndexOuter = Math.round(
    ((Math.PI / 2 - angleOffsetOuter) / anglePerOuterDot + totalOuterDots) %
      totalOuterDots
  );
  const centerIndexInner = Math.round(
    ((Math.PI / 2 - angleOffsetInner) / anglePerInnerDot + totalInnerDots) %
      totalInnerDots
  );

  return (
    <div className="flex items-center justify-start h-screen w-1/2 relative">
      <img src="/round1.png" alt="Background" className="h-[260px]" />

      <div className="absolute left-8">
        <img
          src="innercircle1.png"
          alt="Inner Circle"
          className="h-[650px] w-80"
        />
      </div>

      <div className="absolute left-2">
        <img
          src="innercircle1.png"
          alt="Inner Circle"
          className="h-[450px] w-52"
        />
      </div>

      <div
        ref={circleRefOuter}
        onMouseDown={handleMouseDownOuter}
        className="absolute"
      >
        {dotsOuter.map((dot) => {
          const isMiddleDotOuter = dot.index === centerIndexOuter;
          return (
            <div
              key={`outer-${dot.index}`}
              className="absolute flex flex-row gap-2 items-center justify-center cursor-pointer"
              onClick={() => handleDotClickOuter(dot.index)}
              style={{
                left: `${dot.x}px`,
                top: `${dot.y - 10}px`,
                userSelect: "none",
              }}
            >
              <div
                className={`rounded-full ${
                  isMiddleDotOuter
                    ? "bg-[#3AB8FF] border-[#FFEFA7] border-2"
                    : "bg-[#D8D8D8]"
                }`}
                style={{
                  width: isMiddleDotOuter ? "40px" : "32px",
                  height: isMiddleDotOuter ? "40px" : "32px",
                }}
              />
              <div
                className={`text-sm w-32 ${
                  isMiddleDotOuter
                    ? "font-semibold text-base text-[#4C4C4C]"
                    : "text-[#797979]"
                }`}
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
              >
                {outerCircleData[dot.index].technologyName || "N/A"}
              </div>
            </div>
          );
        })}
      </div>

      <div
        ref={circleRefInner}
        onMouseDown={handleMouseDownInner}
        className="absolute"
      >
        {dotsInner.map((dot) => {
          const isMiddleDotInner = dot.index === centerIndexInner;
          return (
            <div
              key={`inner-${dot.index}`}
              className="absolute flex flex-row gap-2 items-center justify-center cursor-pointer"
              onClick={() => handleDotClickInner(dot.index)}
              style={{
                left: `${dot.x}px`,
                top: `${dot.y - 10}px`,
                userSelect: "none",
              }}
            >
              <div
                className={`rounded-full ${
                  isMiddleDotInner
                    ? "bg-[#3AB8FF] border-[#FFEFA7] border-2"
                    : "bg-[#D8D8D8]"
                }`}
                style={{
                  width: isMiddleDotInner ? "28px" : "20px",
                  height: isMiddleDotInner ? "28px" : "20px",
                }}
              />
              <div
                className={`w-24 ${
                  isMiddleDotInner
                    ? "font-semibold text-[12px] text-[#4C4C4C]"
                    : "text-[#797979] text-[12px]"
                }`}
                style={{ wordWrap: "break-word", whiteSpace: "normal" }}
              >
                {innerCircleData[dot.index].industryName || "N/A"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebTechUsecase;
