import React from "react";
import { Spotlight } from "@/app/admin/spotlights/types/spotlights";

interface SpotlightCardProps {
  spotlight: Spotlight;
  onExploreClick?: (id: string | number) => void;
  isFocused?: boolean;
  isGridView?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  spotlight,
  onExploreClick,
  isFocused = false,
  isGridView = false,
}) => {
  console.log("spotlightInCard", spotlight)
  const getCardClasses = () => {
    if (isGridView) {
      return "w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden";
    }

    return "w-64 sm:w-72 lg:w-80 xl:w-96 h-96 sm:h-80 lg:h-[400px] xl:h-[420px] bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden";
  };

  const getImageClasses = () => {
    if (isGridView) {
      return "relative w-full h-32 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-300";
    }

    return "relative w-full h-40 sm:h-40 lg:h-48 xl:h-56 bg-gradient-to-br from-gray-200 to-gray-300";
  };

  const getBodyClasses = () => {
    return "p-3 sm:p-5 lg:p-6 xl:p-7 flex flex-col justify-between flex-1";
  };

  const getTitleClasses = () => {
    return "font-semibold text-gray-900 leading-tight line-clamp-2 text-sm sm:text-sm lg:text-lg xl:text-xl mb-1 sm:mb-2";
  };

  const getSubtitleClasses = () => {
    return "text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 text-sm sm:text-sm lg:text-base xl:text-lg mb-1 sm:mb-2 xl:mb-3";
  };

  return (
    <div className={`${getCardClasses()} flex flex-col`}>
      {/* Header Image */}
      <div className={getImageClasses()}>
        {spotlight.is_tyn_verified && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
            <img
              src="/spotlights/yellowtick.png"
              alt="TYN Verified"
              className="w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 rounded-full shadow-sm"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="hidden w-5 h-5 sm:w-6 sm:h-6 xl:w-8 xl:h-8 bg-green-500 rounded-full items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        )}

        <div
          className="w-full h-full bg-cover bg-no-repeat bg-center relative"
          style={{
            backgroundImage: spotlight.logo_url
              ? `url(${spotlight.logo_url})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>

          {spotlight.spotlight_category && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-primary text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 rounded-full font-medium shadow-sm z-10">
              {spotlight.spotlight_category}
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className={getBodyClasses()}>
        <div className="flex-1 min-h-0">
          <h3 className={getTitleClasses()}>{spotlight.spotlight_title}</h3>
          {spotlight.spotlight_subtitle && (
            <p className={getSubtitleClasses()}>{spotlight.spotlight_subtitle}</p>
          )}
        </div>

        {/* Explore Button aligned right */}
        <div className="pt-2">
          <button
            onClick={() => onExploreClick?.(spotlight.spotlight_startup)}
            className="group ml-auto w-7 h-7 sm:w-8 sm:h-8 xl:w-10 xl:h-10 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
            aria-label={`Explore ${spotlight.spotlight_title}`}
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7,7 17,7 17,17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotlightCard;
