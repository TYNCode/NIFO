import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchSpotlights } from "../../redux/features/spotlight/spotlightSlice";
import { useRouter } from "next/navigation";
import { encryptURL } from "../../utils/shareUtils";
import MainSpotlightMobile from "./MainSpotlightMobile";

const SpotlightMobile: React.FC = () => {
  const { spotlights } = useAppSelector((state) => state.spotlight);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchSpotlights());
  }, [dispatch]);

  const handleSpotlight = (id: number) => {
    const encodedId = encryptURL(id.toString());
    router.push(`/spotlights/${encodedId}`);
  };

  return (
    <div>
      <MainSpotlightMobile
        spotlights={spotlights}
        handleSpotlight={handleSpotlight}
      />
    </div>
  );
};

export default SpotlightMobile;
