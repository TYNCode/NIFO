import React from "react";
import Image from "next/image";
import { Spotlight } from "../../interfaces";

interface MainSpotlightMobileProps {
  spotlights: Spotlight[];
  handleSpotlight: (id: number) => void;
}

const MainSpotlightMobile: React.FC<MainSpotlightMobileProps> = ({
  spotlights,
  handleSpotlight,
}) => {
  const lastSpotlight = spotlights[spotlights.length - 1];

  if (!lastSpotlight) {
    return null;
  }

  return (
    <div className="mb-32">
      <div className="flex flex-col justify-around gap-4 py-5 items-start mx-7 text-lg">
        <div className="font-medium text-xl">SPOTLIGHT</div>
        <div className="flex flex-col gap-4">
          <div>
            <Image
              src="/thirdai-mobile.png"
              width={500}
              height={200}
              alt="spotlight"
            />
          </div>
          <div className="font-light text-sm">{lastSpotlight.created_at}</div>
        </div>
        <div className="leading-9 tracking-wide line-clamp-4 text-sm">
          {lastSpotlight.spotlight_title}
        </div>
        <div
          className="text-white font-semibold px-2 py-2 bg-blue-400 rounded-md flex items-center justify-center mx-auto cursor-pointer"
          onClick={() => handleSpotlight(lastSpotlight.id)}
        >
          See more
        </div>
      </div>


      <div>
        <div className="mx-4 uppercase my-4">More Spotlights</div>
      {spotlights.slice(0, -1).map((spotlight: Spotlight, index: number) => {
        return (
          <div className="p-2 flex gap-4 text-xs border border-gray-200 m-2 overflow-hidden max-w-full" key={index} onClick={()=> handleSpotlight(spotlight.id)}>
            <div className="w-1/5 flex items-center">
              <img
                src={spotlight.spotlight_img}
                alt="Spotlight Logo"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="w-4/5">{spotlight.spotlight_title}</div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default MainSpotlightMobile;
