import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import sectorData from "../../data/data_sector.json";

const WebTechUsecase = ({
  selectedSector,
  selectedIndustry: propSelectedIndustry,
  handleGoSector,
  onTechnologyClick,
  selectedTechnology,
}) => {
  const sectors = sectorData.sectors;

  const [selectedIndustry, setSelectedIndustry] =
    useState(propSelectedIndustry);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isRendered, setIsRendered] = useState(false); // New state to control re-render

  const getInitialTechnologyData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );
    const selectedIndustryData =
      selectedSectorData?.subSectors[selectedIndustry];

    return selectedIndustryData
      ? selectedIndustryData.map((technology) => ({
          sectorName: selectedSectorData.sector,
          industryName: selectedIndustry,
          technologyTrend: technology.technologyTrend,
        }))
      : [];
  };

  const getInitialSubSectorsData = () => {
    const selectedSectorData = sectors.find(
      (sector) => sector.sector === selectedSector
    );
    return selectedSectorData
      ? Object.keys(selectedSectorData.subSectors).map((subSector) => ({
          sectorName: selectedSectorData.sector,
          subSectorName: subSector,
        }))
      : [];
  };

  const [outerCircleData, setOuterCircleData] = useState([]);
  const [innerCircleData, setInnerCircleData] = useState([]);

  const totalOuterDots = outerCircleData.length;
  const totalInnerDots = innerCircleData.length;
  const anglePerOuterDot = (2 * Math.PI) / totalOuterDots;
  const anglePerInnerDot = (2 * Math.PI) / totalInnerDots;

  const [angleOffsetOuter, setAngleOffsetOuter] = useState(Math.PI / 2);
  const [angleOffsetInner, setAngleOffsetInner] = useState(Math.PI / 2);

  const [isDraggingOuter, setIsDraggingOuter] = useState(false);
  const [lastMouseYOuter, setLastMouseYOuter] = useState(null);

  const circleRefOuter = useRef(null);

  const radiusXOuter =
    screenWidth >= 1536
      ? 310
      : screenWidth >= 1280
      ? 314
      : screenWidth >= 1024
      ? 252
      : 180;
  const radiusYOuter = radiusXOuter;
  const radiusXInner =
    screenWidth >= 1536
      ? 170
      : screenWidth >= 1280
      ? 164
      : screenWidth >= 1024
      ? 125
      : 90;
  const radiusYInner = radiusXInner;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Run after initial render to recalculate positions
  useLayoutEffect(() => {
    setOuterCircleData(getInitialTechnologyData());
    setInnerCircleData(getInitialSubSectorsData());

    // Delay the recalculation to ensure layout is complete
    setTimeout(() => {
      setIsRendered(true); // Trigger re-render based on fully rendered layout
    }, 100); // Adjust this delay if necessary
  }, [selectedSector, selectedIndustry, screenWidth]);

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
    if (
      circleRefOuter.current &&
      circleRefOuter.current.contains(event.target)
    ) {
      setIsDraggingOuter(true);
      setLastMouseYOuter(event.clientY);
    }
  };

  const handleDotClickInner = (dotIndex) => {
    const newSelectedIndustry = innerCircleData[dotIndex].subSectorName;
    setSelectedIndustry(newSelectedIndustry);

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

  const handleDotClickOuter = (dotIndex) => {
    const normalizedAngleOuterOffset =
      ((angleOffsetOuter % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const currentOuterCenterIndex = Math.round(
      ((Math.PI / 2 - normalizedAngleOuterOffset) / anglePerOuterDot +
        totalOuterDots) % totalOuterDots
    );
    const outerDistance =
      (dotIndex - currentOuterCenterIndex + totalOuterDots) % totalOuterDots;
    const shortestOuterDistance =
      outerDistance <= totalOuterDots / 2
        ? outerDistance
        : outerDistance - totalOuterDots;
    const outerAngleDifference = shortestOuterDistance * anglePerOuterDot;
    setAngleOffsetOuter((prevOffset) => prevOffset - outerAngleDifference);

    const selectedTechnologyData = outerCircleData[dotIndex].technologyTrend;
    onTechnologyClick(selectedTechnologyData);
  };

  const dotsOuter = Array.from({ length: totalOuterDots }).map((_, index) => {
    const outerAngle =
      (index / totalOuterDots) * Math.PI * 2 + angleOffsetOuter;
    const x = radiusXOuter * Math.sin(outerAngle);
    const y = radiusYOuter * Math.cos(outerAngle);
    return { x, y, index };
  });

  const dotsInner = Array.from({ length: innerCircleData.length }).map(
    (_, index) => {
      const innerAngle =
        (index / innerCircleData.length) * Math.PI * 2 + angleOffsetInner;
      const x = radiusXInner * Math.sin(innerAngle);
      const y = radiusYInner * Math.cos(innerAngle);
      return { x, y, index };
    }
  );

  const centerIndexOuter = Math.round(
    ((Math.PI / 2 - angleOffsetOuter) / anglePerOuterDot + totalOuterDots) %
      totalOuterDots
  );
  const centerIndexInner = Math.round(
    ((Math.PI / 2 - angleOffsetInner) / anglePerInnerDot + totalInnerDots) %
      totalInnerDots
  );

  return (
    <div className="flex items-center justify-start h-[calc(100vh-64px)] w-1/2 relative ">
      <div className="relative">
        <img
          src="/round1.png"
          alt="Background"
          className="2xl:h-[216px] xl:h-[256px] lg:h-[216px]"
        />
        <div className="absolute inset-0 left-2 right-2 flex items-center justify-center">
          <div
            className="text-sm font-semibold text-gray-700 cursor-pointer z-10"
            onClick={handleGoSector}
          >
            {selectedSector}
          </div>
        </div>
      </div>
      <div className="absolute left-8">
        <img
          src="innerarc1.svg"
          alt="Inner Circle"
          className="2xl:h-[620px] xl:h-[650px] lg:h-[500px] "
        />
      </div>

      <div className="absolute left-2">
        <img
          src="innerarc1.svg"
          alt="Inner Circle"
          className="2xl:h-[360px] xl:h-[360px] lg:h-[260px]"
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
                top: `${dot.y - 16}px`,
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
                {outerCircleData[dot.index]?.technologyTrend || "N/A"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute">
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
                {innerCircleData[dot.index].subSectorName || "N/A"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebTechUsecase;
