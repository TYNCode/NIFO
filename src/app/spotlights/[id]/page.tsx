"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import shareHook from "../../redux/customHooks/shareHook";
import { decryptURL } from "../../utils/shareUtils";
import { fetchSpotlightById } from "../../redux/features/spotlight/spotlightSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import SpotlightPage from "../../components/Spotlights/SpotlightPage";
import NavBar from "../../components/Navbar";

const SelectSpotlight = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  let encodedSessionID = params.id;

  if (Array.isArray(encodedSessionID)) {
    encodedSessionID = encodedSessionID[0];
  }

  if (typeof encodedSessionID !== "string") {
    console.error("Invalid ID in URL");
    return null;
  }

  const decryptedSessionId = decryptURL(encodedSessionID);

  const { selectedSpotlight, error, loading } = useAppSelector(
    (state) => state.spotlight
  );

  useEffect(() => {
    if (decryptedSessionId) {
      dispatch(fetchSpotlightById(Number(decryptedSessionId)));
    }
  }, [decryptedSessionId, dispatch]);

  const handleSpotlightShare = async () => {
    const shareUrl: string = `${window.location.origin}/spotlights/${encodedSessionID}`;
    shareHook(shareUrl);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedSpotlight) return <div>No Spotlight found</div>;

  return (
    <div className="mb-40 md:px-96">
    {/* <NavBar/> */}
    <SpotlightPage selectedSpotlight={selectedSpotlight} handleSpotlightShare={handleSpotlightShare}/>
    </div>
  );
};

export default SelectSpotlight;
