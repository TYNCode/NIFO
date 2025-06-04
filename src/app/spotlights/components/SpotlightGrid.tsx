"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { Spotlight } from "@/app/admin/spotlights/types/spotlights";
import SpotlightCard from "./SpotlightCard";

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

interface SpotlightGridProps {
  spotlights: Spotlight[];
  onExploreClick?: (id: string | number) => void;
}

const SpotlightGrid: React.FC<SpotlightGridProps> = ({
  spotlights,
  onExploreClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const width = useWindowWidth();
  const touchStartX = useRef<number | null>(null);

  const isMobileOrTablet = width < 1024;

  // Remove duplicates if any
  const filteredSpotlights = useMemo(() => {
    return spotlights.filter(
      (s, index, self) => index === self.findIndex((t) => t.id === s.id)
    );
  }, [spotlights]);

  useEffect(() => {
    if (!isAutoPlay || filteredSpotlights.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < filteredSpotlights.length - 1 ? prev + 1 : 0
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredSpotlights.length]);

  useEffect(() => {
    if (
      currentIndex >= filteredSpotlights.length &&
      filteredSpotlights.length > 0
    ) {
      setCurrentIndex(0);
    }
  }, [filteredSpotlights.length, currentIndex]);

  const goToPrevious = useCallback(() => {
    if (filteredSpotlights.length === 0) return;
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredSpotlights.length - 1
    );
  }, [filteredSpotlights.length]);

  const goToNext = useCallback(() => {
    if (filteredSpotlights.length === 0) return;
    setCurrentIndex((prev) =>
      prev < filteredSpotlights.length - 1 ? prev + 1 : 0
    );
  }, [filteredSpotlights.length]);

  const getVisibleCards = useMemo(() => {
    const count = filteredSpotlights.length;
    if (count === 0) return [];

    let positions: number[] = [];

    if (count === 1) {
      positions = [0];
    } else if (count === 2) {
      positions = [-1, 0];
    } else if (count === 3) {
      positions = [-1, 0, 1];
    } else {
      if (width >= 1024) {
        positions = [-2, -1, 0, 1, 2];
      } else if (width >= 768) {
        positions = [-1, 0, 1];
      } else {
        positions = [-1, 0, 1];
      }
    }

    return positions.map((i) => {
      let index = (currentIndex + i + count) % count;
      return { spotlight: filteredSpotlights[index], position: i };
    });
  }, [filteredSpotlights, currentIndex, width]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) goToPrevious();
    else if (deltaX < -50) goToNext();
    touchStartX.current = null;
  };

  if (filteredSpotlights.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg">
          No spotlights found with current filters
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
        <p className="text-gray-600 font-semibold text-base hidden sm:block">
          Showing {filteredSpotlights.length} spotlight
          {filteredSpotlights.length !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          {filteredSpotlights.length > 1 && (
            <button
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                isAutoPlay
                  ? "bg-blue-100 text-primary"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isAutoPlay ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="text-sm" />
              )}
              {isAutoPlay ? "Pause" : "Play"}
            </button>
          )}

          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {filteredSpotlights.length}
          </div>
        </div>
      </div>

      <div
        className="relative flex items-center justify-center min-h-[400px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {getVisibleCards.map(({ spotlight, position }) => {
          let transform = "";
          let opacity = 0.9;
          let zIndex = 10;

          if (position === 0) {
            transform = "translateX(0) scale(1)";
            opacity = 1;
            zIndex = 30;
          } else if (width < 768) {
            if (position === -1) {
              transform = "translateX(-100px) scale(0.85) rotateY(8deg)";
              zIndex = 5;
            }
            if (position === 1) {
              transform = "translateX(100px) scale(0.85) rotateY(-8deg)";
              zIndex = 5;
            }
          } else if (width < 1024) {
            if (position === -1) {
              transform = "translateX(-120px) scale(0.9) rotateY(10deg)";
              zIndex = 10;
            }
            if (position === 1) {
              transform = "translateX(120px) scale(0.9) rotateY(-10deg)";
              zIndex = 10;
            }
          } else {
            if (position === -2) {
              transform = "translateX(-320px) scale(0.65) rotateY(20deg)";
              zIndex = 5;
            }
            if (position === -1) {
              transform = "translateX(-180px) scale(0.85) rotateY(10deg)";
              zIndex = 10;
            }
            if (position === 1) {
              transform = "translateX(180px) scale(0.85) rotateY(-10deg)";
              zIndex = 10;
            }
            if (position === 2) {
              transform = "translateX(320px) scale(0.65) rotateY(-20deg)";
              zIndex = 5;
            }
          }

          const style: React.CSSProperties = {
            transformStyle: "preserve-3d",
            transform,
            zIndex,
            opacity,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          };

          return (
            <div
              key={`${spotlight.id}-${position}`}
              className="absolute"
              style={style}
            >
              <SpotlightCard
                spotlight={spotlight}
                onExploreClick={onExploreClick}
                isFocused={position === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons - Desktop only */}
      {!isMobileOrTablet && filteredSpotlights.length > 1 && (
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={goToPrevious}
            className="group w-12 h-12 bg-primary  text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Previous spotlight"
          >
            <FaChevronLeft className="text-lg transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>

          <div className="flex gap-2">
            {filteredSpotlights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to spotlight ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="group w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Next spotlight"
          >
            <FaChevronRight className="text-lg transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotlightGrid;
