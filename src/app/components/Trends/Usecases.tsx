"use client";

import React, { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const swipeVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const Usecases = ({ selectedSector, selectedIndustry, selectedSubindustry, onUsecaseClick }) => {
  const [useCases, setUseCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add("lock-scroll");
    return () => document.body.classList.remove("lock-scroll");
  }, []);

  useEffect(() => {
    const fetchUsecases = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://tyn-server.azurewebsites.net/trends/");
        const data = await res.json();

        const normalize = (str) => str?.trim().toLowerCase();

        const filtered = data.filter((item) => {
          const sectorMatch = !selectedSector || normalize(item.sector) === normalize(selectedSector);
          const industryMatch = !selectedIndustry || normalize(item.industry) === normalize(selectedIndustry);
          const subindustryMatch = !selectedSubindustry || normalize(item.sub_industry) === normalize(selectedSubindustry);
          return sectorMatch && industryMatch && subindustryMatch;
        });

        const finalUsecases = filtered.length > 0 ? filtered : data;

        const formatted = finalUsecases.map((item) => ({
          id: item.id,
          useCase: item.challenge_title,
          fullData: item,
        }));

        setUseCases(formatted);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching use cases:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsecases();
  }, [selectedSector, selectedIndustry, selectedSubindustry]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      return (next + useCases.length) % useCases.length;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const currentUseCase = useCases[currentIndex];

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-[#0071C1] font-medium animate-pulse">
        Loading usecases...
      </div>
    );
  }

  if (!currentUseCase) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
        No use cases found.
      </div>
    );
  }

  const imageUrl = currentUseCase.fullData?.images?.[0] || "/fallback.jpg";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-2xl font-bold text-center mt-4 mb-6 bg-gradient-to-r from-[#2287C0] to-[#56ccf2] text-transparent bg-clip-text animate-pulse">
        Explore the Usecase
      </div>

      <div
        className="relative h-[220px] w-[90%] max-w-[600px] justify-center items-center"
        {...swipeHandlers}
      >
        {/* Left Arrow */}
        <div
          className="absolute -left-8 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-black/40 p-1 rounded-full"
          onClick={() => paginate(-1)}
        >
          <BsArrowRight className="rotate-180 text-white" size={20} />
        </div>

        {/* Right Arrow */}
        <div
          className="absolute -right-8 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-black/40 p-1 rounded-full"
          onClick={() => paginate(1)}
        >
          <BsArrowRight className="text-white" size={20} />
        </div>

        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentUseCase.id}
            className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl cursor-pointer"
            onClick={() => onUsecaseClick(currentUseCase.fullData)}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={imageUrl}
                alt="usecase"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/fallback.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-100" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full mt-4 px-5 py-3 text-white">
              <div>
                <div className="text-xl font-semibold">
                  {currentUseCase.useCase}
                </div>
                <div className="text-sm mt-4 opacity-70 line-clamp-3">
                  {currentUseCase.fullData?.challenge}
                </div>
              </div>
              <div className="flex justify-end items-center pb-4">
                <div className="p-2 bg-white/50 rounded-full">
                  <BsArrowRight size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Usecases;
