import React, { useEffect, useState } from "react";

const CurvedLineDown = ({ selectedSector, onIndustryClick }) => {
  const radius = 164;
  const centerX = 154;
  const centerY = 154;

  const [industryNames, setIndustryNames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalPositions = industryNames.length;
  const highlightedPosition = Math.floor(totalPositions / 2);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch(
          `https://tyn-server.azurewebsites.net/api/api/trends/?sector=${encodeURIComponent(
            selectedSector
          )}`
        );
        const data = await res.json();

        const uniqueIndustries = [
          ...new Set(data.map((item) => item.industry)),
        ].slice(0, 8);

        setIndustryNames(uniqueIndustries);
        setCurrentIndex(0);
        setRotationOffset(0);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setIndustryNames(["No Industries Found"]);
      }
    };

    if (selectedSector) {
      fetchIndustries();
    }
  }, [selectedSector]);

  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null || isAnimating) return;

    const deltaX = e.touches[0].clientX - startX;

    if (Math.abs(deltaX) > 20) {
      handleScroll(deltaX > 0 ? "next" : "prev");
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const handleScroll = (direction) => {
    if (isAnimating || totalPositions <= 1) return;
    setIsAnimating(true);

    const step = (2 * Math.PI) / totalPositions;

    if (direction === "next") {
      setRotationOffset((prev) => prev - step);
      setCurrentIndex((prev) => (prev + 1) % totalPositions);
    } else {
      setRotationOffset((prev) => prev + step);
      setCurrentIndex(
        (prev) => (prev - 1 + totalPositions) % totalPositions
      );
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      className="relative flex justify-end items-end select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <img src="/circle.svg" alt="" className="w-32" />
      </div>

      <div className="absolute">
        <div className="relative w-44">
          <div>
            <img src="/circle2.svg" alt="" className="w-44" />
            <div className="absolute bottom-10 right-2 flex justify-center items-center">
              <span className="text-base font-semibold uppercase text-gray-700">
                INDUSTRY
              </span>
            </div>
          </div>

          {industryNames.map((industry, index) => {
            let angle =
              (index / totalPositions) * 2 * Math.PI + rotationOffset;

            if (totalPositions === 1) {
              angle = Math.PI / 2; // Place in center
            }

            const x = centerX + radius * Math.cos(angle);
            const y = centerY - radius * Math.sin(angle);

            const isHighlighted =
              index === (currentIndex + highlightedPosition) % totalPositions;

            return (
              <div
                key={index}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  visibility: "visible",
                }}
              >
                <div
                  className={`relative rounded-full shadow-lg cursor-pointer ${isHighlighted
                      ? "bg-[#3AB8FF] border-2 border-[#FFEFA7] w-7 h-7"
                      : "bg-[#D8D8D8] w-5 h-5"
                    }`}
                  onClick={() => onIndustryClick(industry)}
                >
                  <div
                    className={`absolute right-full mr-2 bottom-2 text-sm w-32 text-right ${isHighlighted
                        ? "font-semibold text-base text-[#4C4C4C]"
                        : "text-[#797979]"
                      }`}
                  >
                    {industry}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurvedLineDown;
