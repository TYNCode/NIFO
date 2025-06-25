import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

const WebIndustries = ({
  selectedSector,
  selectedIndustry,
  onDotClick,
  handleGoSector,
  onActiveSubSectorChange,
  onWebCircleTwoClick
}) => {
  const [activeCenterIndex, setActiveCenterIndex] = useState(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
 
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


  const [outerCircleData, setOuterCircleData] = useState([]);

  useEffect(() => {
    const fetchIndustriesWithUsecases = async () => {
      try {
        const usecaseResponse = await fetch("https://tyn-server.azurewebsites.net/api/trends/");
        const usecaseData = await usecaseResponse.json();

        console.log("usecasedata", usecaseData)

        const validIndustriesSet = new Set(
          usecaseData
            .filter((item) => item.sector === selectedSector)
            .map((item) => item.industry)
        );

        const filteredIndustries = Array.from(validIndustriesSet)
          .slice(0, 8)
          .map((industry) => ({
            industryName: industry,
            technologies: [], 
          }));

        console.log("filteredIndustries", filteredIndustries)

        setOuterCircleData(filteredIndustries);
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };
    

    if (selectedSector) fetchIndustriesWithUsecases();
  }, [selectedSector]);
  
    
  const selectedIndustryIndex = outerCircleData.findIndex(
    (industry) => industry.industryName === selectedIndustry
  );
  
  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;
  const [angleOffset, setAngleOffset] = useState(
    selectedIndustryIndex >= 0
      ? Math.PI / 2 - selectedIndustryIndex * anglePerDot
      : Math.PI / 2
  );
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [screenWidth, setScreenWidth] = useState(1024);
  const innerArcRef = useRef(null);
  const [innerArcRect, setInnerArcRect] = useState(null);

  const radiusX =
    screenWidth >= 1536
      ? 282
      : screenWidth >= 1280
      ? 258
      : screenWidth >= 1024
      ? 226
      : 220;
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

  const dots = Array.from({ length: totalDots }).map((_, index) => {
    const angle = (index / totalDots) * Math.PI * 2 + angleOffset;
    const x = radiusX * Math.sin(angle);
    const y = radiusY * Math.cos(angle);
    return { x, y, index };
  });

  const handleWheel = (event) => {
    const delta = event.deltaY;
    const scrollSpeed = 0.005;
    const newOffset = angleOffset - delta * scrollSpeed;
    setAngleOffset(newOffset);
    setHasUserScrolled(true);

    const normalizedAngleOffset =
      ((newOffset % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const currentCenterIndex = Math.round(
      ((Math.PI / 2 - normalizedAngleOffset) / anglePerDot + totalDots) % totalDots
    );
    setActiveCenterIndex(currentCenterIndex);
  };

  useEffect(() => {
    if (!outerCircleData.length || activeCenterIndex === null) return;

    const activeIndustry = outerCircleData[activeCenterIndex]?.industryName;
    if (activeIndustry) {
      onActiveSubSectorChange?.(activeIndustry);
    }
  }, [activeCenterIndex]);
  
  

  return (
    <div
      className="flex items-center justify-start h-[calc(100vh-64px)] w-1/2 relative"
      onWheel={handleWheel}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative inline-block">
        <img
          src="/round1.png"
          alt="Background"
          className="2xl:h-[400px] xl:h-[380px] lg:h-[300px]"
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 left-4 right-8 flex items-center justify-center">
          <div
            className="text-lg font-semibold text-gray-700 cursor-pointer z-10"
            onClick={handleGoSector}
          >
            {selectedSector}
          </div>
        </div>
      </div>

      <div className="absolute left-8" ref={innerArcRef}>
        <img
          src="innerarc1.svg"
          alt="Inner Circle"
          className="2xl:h-[580px] xl:h-[520px] lg:h-[450px]"
          onLoad={handleImageLoad}
        />
      </div>

      {innerArcRect && dots.map((dot) => {
        const isMiddleDot = dot.index === activeCenterIndex; 
        const innerArcRect = innerArcRef.current?.getBoundingClientRect();
        const innerArcCenterX = innerArcRect
          ? innerArcRect.left + innerArcRect.width / 2
          : 0;
        const innerArcCenterY = innerArcRect
          ? innerArcRect.top + innerArcRect.height / 2
          : 0;

        const horizontalOffsetPercent = -0.3; 
        const verticalOffsetPercent =
          screenWidth >= 1536
            ? -0.10
            : screenWidth >= 1280
            ? -0.11
            : screenWidth >= 1024
            ? -0.12
            : -0.115
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
              left: `${innerArcCenterX + dot.x + horizontalOffset}px`,
              top: `${innerArcCenterY + dot.y + verticalOffset}px`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => {
              setActiveCenterIndex(dot.index);
              const clickedIndustry = outerCircleData[dot.index].industryName; 
              onDotClick?.(clickedIndustry);
              onWebCircleTwoClick?.(clickedIndustry);
            }}
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
                {outerCircleData[dot.index].industryName || "N/A"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WebIndustries;
