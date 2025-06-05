import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

const ThirdLeftCircle = ({
  selectedSector,
  selectedIndustry,
  onDotClick,
  handleGoSector,
  onActiveSubSectorChange,
}) => {
  const [outerCircleData, setOuterCircleData] = useState([]);
  const [activeCenterIndex, setActiveCenterIndex] = useState(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [innerArcRect, setInnerArcRect] = useState(null);
  const [angleOffset, setAngleOffset] = useState(Math.PI / 2);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [screenWidth, setScreenWidth] = useState(1024);
  const innerArcRef = useRef(null);

  useLayoutEffect(() => {
    if (innerArcRef.current) {
      setInnerArcRect(innerArcRef.current.getBoundingClientRect());
    }
  }, []);

  const handleImageLoad = () => {
    if (innerArcRef.current) {
      setInnerArcRect(innerArcRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    const fetchSubIndustries = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/trends/");
        const data = await response.json();

        const filtered = data.filter(
          (item) =>
            item.sector === selectedSector &&
            item.industry === selectedIndustry &&
            item.sub_industry &&
            item.sub_industry !== "Unknown"
        );

        const uniqueSubIndustries = Array.from(
          new Set(filtered.map((item) => item.sub_industry))
        );

        const formatted = uniqueSubIndustries.slice(0, 8).map((subindustry) => ({
          subIndustryName: subindustry,
        }));

        setOuterCircleData(formatted);
      } catch (err) {
        console.error("Failed to fetch subindustries:", err);
      }
    };

    if (selectedSector && selectedIndustry) {
      fetchSubIndustries();
    }
  }, [selectedSector, selectedIndustry]);

  const selectedSubIndustryIndex = outerCircleData.findIndex(
    (sub) => sub.subIndustryName === selectedIndustry
  );

  const totalDots = outerCircleData.length;
  const anglePerDot = (2 * Math.PI) / totalDots;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => setScreenWidth(window.innerWidth);
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  const radiusX = screenWidth >= 1536 ? 282 : screenWidth >= 1280 ? 258 : 226;
  const radiusY = radiusX;

  useEffect(() => {
    const move = (e) => isDragging && handleMouseMoveHandler(e);
    const up = () => {
      setIsDragging(false);
      setLastMouseY(null);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isDragging, lastMouseY]);

  const handleMouseMoveHandler = (e) => {
    const { clientY } = e;
    if (lastMouseY !== null) {
      const deltaY = clientY - lastMouseY;
      const speed = 0.005;
      setAngleOffset((prev) => prev - deltaY * speed);
    }
    setLastMouseY(clientY);
  };

  const handleWheel = (e) => {
    const newOffset = angleOffset - e.deltaY * 0.005;
    setAngleOffset(newOffset);
    setHasUserScrolled(true);

    const normalizedOffset = ((newOffset % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const centerIndex = Math.round(((Math.PI / 2 - normalizedOffset) / anglePerDot + totalDots) % totalDots);
    setActiveCenterIndex(centerIndex);
  };

  useEffect(() => {
    if (activeCenterIndex !== null && outerCircleData[activeCenterIndex]) {
      onActiveSubSectorChange?.(outerCircleData[activeCenterIndex].subIndustryName);
    }
  }, [activeCenterIndex, outerCircleData, onActiveSubSectorChange]);

  const dots = Array.from({ length: totalDots }).map((_, index) => {
    const angle = index * anglePerDot + angleOffset;
    const x = radiusX * Math.sin(angle);
    const y = radiusY * Math.cos(angle);
    return { x, y, index };
  });

  return (
    <div
      className="flex items-center justify-start h-[calc(100vh-64px)] w-1/2 relative"
      onWheel={handleWheel}
      onClick={(e) => e.stopPropagation()}
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

      {innerArcRect &&
        dots.map((dot) => {
          const isCenter = dot.index === activeCenterIndex;
          const arcRect = innerArcRef.current.getBoundingClientRect();
          const centerX = arcRect.left + arcRect.width / 2;
          const centerY = arcRect.top + arcRect.height / 2;
          const offsetX = arcRect.width * -0.3;
          const offsetY =
            screenWidth >= 1536
              ? arcRect.height * -0.1
              : screenWidth >= 1280
                ? arcRect.height * -0.11
                : arcRect.height * -0.12;

          return (
            <div
              key={dot.index}
              className="absolute flex flex-col items-center justify-center cursor-pointer"
              style={{
                left: `${centerX + dot.x + offsetX}px`,
                top: `${centerY + dot.y + offsetY}px`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onDotClick(outerCircleData[dot.index].subIndustryName)}
            >
              <div className={`flex flex-row items-center justify-center ${isCenter ? "border-blue-500" : "border-black"}`}>
                <div
                  className={`rounded-full flex items-center justify-center ${isCenter ? "bg-[#3AB8FF] border-[#FFEFA7] border-2" : "bg-[#D8D8D8]"
                    } ${isCenter ? "w-10 h-10" : "w-8 h-8"}`}
                ></div>
                <div
                  className={`text-sm w-32 ${isCenter ? "font-semibold text-base text-[#4C4C4C]" : "text-[#797979]"}`}
                  style={{ wordWrap: "break-word", whiteSpace: "normal" }}
                >
                  {outerCircleData[dot.index].subIndustryName || "N/A"}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ThirdLeftCircle;
