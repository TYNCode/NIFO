import React from "react";
import Image from "next/image";
import { Spotlight } from "../../interfaces";

interface SpotlightBarProps {
  lastSpotlight: Spotlight
  handleSpotlight: (id: number) => void;
}

const SpotlightBar: React.FC<SpotlightBarProps> = ({ lastSpotlight, handleSpotlight }) => {
  return (
    <div>
      <div className="text-base py-3 px-2 text-gray-400 font-semibold">
        Spotlight
      </div>
      <div className="mx-4">
        <div className="flex justify-center items-center cursor-pointer">
          <Image
            src="/thirdai-logo.png"
            alt="Third AI"
            width={100}
            height={50}
          />
        </div>
        <div className="text-balance line-clamp-4">{lastSpotlight.spotlight_title}</div>
        <div className="flex flex-row mt-4 gap-x-3 justify-center">
          <div>
            <a
              className="text-sky-700 font-medium cursor-pointer"
              onClick={() => handleSpotlight(lastSpotlight.id)}
            >
              See more..
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightBar;
