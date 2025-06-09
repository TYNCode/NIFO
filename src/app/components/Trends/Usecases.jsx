"use client";

import React, { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const swipeConfidenceThreshold = 10000;

const Usecases = ({ selectedSector, selectedIndustry, onUsecaseClick }) => {
  const [useCases, setUseCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsecases = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://tyn-server.azurewebsites.net/trends/");
        const data = await res.json();
        const filtered = data.filter(
          (item) =>
            item.sector === selectedSector &&
            item.industry === selectedIndustry
        );

        const formatted = filtered.map((item) => ({
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

    if (selectedSector && selectedIndustry) {
      fetchUsecases();
    }
  }, [selectedSector, selectedIndustry]);

  const paginate = (direction) => {
    setCurrentIndex((prevIndex) =>
      direction === 1
        ? (prevIndex + 1) % useCases.length
        : (prevIndex - 1 + useCases.length) % useCases.length
    );
  };

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
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#2287C0] to-[#56ccf2] text-transparent bg-clip-text animate-pulse">
        Explore the Usecase
      </h2>

      <div className="relative h-[220px] w-[90%] max-w-[600px] justify-center items-center">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentUseCase.id}
            className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl cursor-pointer"
            onClick={() => onUsecaseClick(currentUseCase.fullData)}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full px-5 py-3 text-white">
              <div>
                <div className="text-xl font-semibold">
                  {currentUseCase.useCase}
                </div>
                <div className="text-xs mt-2 opacity-70 line-clamp-3">
                  {currentUseCase.fullData?.challenge}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <div className="p-2 bg-white/20 rounded-full">
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
