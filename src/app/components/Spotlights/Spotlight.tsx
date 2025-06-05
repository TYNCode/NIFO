import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchSpotlights } from "../../redux/features/spotlight/spotlightSlice";
import { encryptURL } from "../../utils/shareUtils";
import SpotlightBar from "../Spotlights/SpotlightBar";
import Image from "next/image";

const Spotlight: React.FC = () => {
  const { spotlights } = useAppSelector((state) => state.spotlight);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  if (spotlights.length === 0) {
    return <div>No spotlights available.</div>;
  }

  const lastSpotlight = spotlights[spotlights.length - 1];

  const handleSpotlight = (id: number) => {
    const encodedId = encryptURL(id.toString());
    router.push(`/spotlights/${encodedId}`);
  };

  return (
    <>
      <SpotlightBar lastSpotlight={lastSpotlight} handleSpotlight={handleSpotlight} />
      <div className="my-4">
      <div className="mx-2 uppercase text-semibold text-sm">
        More Spotlights
      </div>
      {spotlights.slice(0, -1).map((spotlight: any, index: number) => (
        <div
          key={index}
          className="p-2 flex gap-4 text-xs border border-gray-200 m-2 overflow-hidden max-w-full cursor-pointer"
          onClick={() => handleSpotlight(spotlight.id)}
        >
          <div className="w-1/5 flex items-center">
            <Image
              src={spotlight.spotlight_img}
              width={100}
              height={100}
              alt="Spotlight Logo"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="w-4/5 line-clamp-4">{spotlight.spotlight_title}</div>
        </div>
      ))}
      </div>
    </>
  );
};

export default Spotlight;
