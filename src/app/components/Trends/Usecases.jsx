"use client";

import React, { useState } from "react";
import sectorsData from "../../data/data_sector.json";
import { BsArrowRight } from "react-icons/bs";

const Usecases = ({
  selectedIndustry,
  selectedTechnology,
  onUsecaseClick,
  selectedSector,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const [slide, setSlide] = useState("enter");
  const [touchStartX, setTouchStartX] = useState(0);

  const selectedSectorData = sectorsData.sectors.find(
    (sector) => sector.sector === selectedSector
  );

  const selectedIndustryData = selectedSectorData
    ? selectedSectorData.subSectors[selectedIndustry]
    : null;

  const technologyTrendsData = selectedIndustryData
    ? selectedIndustryData.find(
        (technologyTrend) =>
          technologyTrend.technologyTrend === selectedTechnology
      )
    : null;

  const useCases = technologyTrendsData ? technologyTrendsData.useCases : [];
  const handleNextUsecase = () => {
    if (isAnimating || useCases.length <= 1) return;
    setDirection(-1);
    setSlide("exit-left");
    setIsAnimating(true);
  };

  const handlePreviousUsecase = () => {
    if (isAnimating || useCases.length <= 1) return;
    setDirection(1);
    setSlide("exit-right");
    setIsAnimating(true);
  };

  const handleTouchStart = (e) => {
    if (isAnimating) return;
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e) => {
    if (isAnimating) return;
    const touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > 50) {
      handleNextUsecase();
    } else if (swipeDistance < -50) {
      handlePreviousUsecase();
    }
  };

  const handleTransitionEnd = () => {
    if (direction === -1) {
      setCurrentIndex((prevIndex) =>
        prevIndex === useCases.length - 1 ? 0 : prevIndex + 1
      );
    } else if (direction === 1) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? useCases.length - 1 : prevIndex - 1
      );
    }
    setSlide("enter");
    setIsAnimating(false);
  };

  const currentUseCase = useCases.length > 0 ? useCases[currentIndex] : null

  const handleUsecaseClick = () => {
    if (currentUseCase) {
      onUsecaseClick(currentUseCase); 
    }
  };

  return (
    <div
      className="flex justify-between items-center gap-4 mb-8 mx-1 overflow-hidden relative h-40"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-center w-10 z-10">
        <div className="inline-block px-6 py-1 border border-[#0081CA] bg-[#F0FAFF] uppercase font-medium transform -rotate-90 text-nowrap text-sm">
          Use Cases
        </div>
      </div>

      {currentUseCase && (
        <div
          key={currentUseCase.useCase}
          className={`flex flex-col justify-between border shadow-xl px-7 py-4 rounded-md text-center w-full h-24 cursor-pointer ${slide}`}
          onClick={handleUsecaseClick}
          onTransitionEnd={handleTransitionEnd}
        >
          <div>{currentUseCase.useCase}</div>
          <div className="flex text-[#0081CA] justify-end">
            <BsArrowRight size={24} />
          </div>
        </div>
      )}

      {useCases.length > 1 && (
        <div
          className="border-2 rounded-full p-2 text-[#0081CA] border-[#0081CA] cursor-pointer z-10 flex items-center justify-center h-10 w-10"
          onClick={handleNextUsecase}
        >
          <BsArrowRight size={24} />
        </div>
      )}
    </div>
  );
};

export default Usecases;
