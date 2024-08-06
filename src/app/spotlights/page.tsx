"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";

const page = () => {
  function getFormattedDate() {
    const today = new Date();
    return today
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", "");
  }
  const [cdate, setCDate] = useState<any>(getFormattedDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setCDate(getFormattedDate());
    }, 1000 * 60 * 60 * 12);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const handleSpotlightShare = async () => {
    const shareUrl: string = `${window.location.origin}/spotlights`;
    console.log(shareUrl, "shareurll-->spotlight");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Share Spotlight",
          url: shareUrl,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };
  return (
    <div className="mb-40 md:px-96">
      {/* Image */}
      <div>
        <Image
          src="/thirdai-mobile.png"
          width={540}
          height={200}
          alt="spotlight"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-gray-100">
        <div className="leading-9 tracking-wide line-clamp-4 font-medium">
          How ThirdAI revolutionizes AI with sparse computing, enabling
          efficient, cost-effective deep learning on standard CPUs, driving AI
          accessibility and deployment trends
        </div>
        <div className="font-light text-sm">{cdate}</div>
      </div>

      {/* Export Icons */}
      <div className="flex justify-between  px-6 py-4">
        <div className="flex gap-8">
          {/* Share button */}
          <div
            className="flex flex-col gap-1 text-xs items-center cursor-pointer"
            onClick={handleSpotlightShare}
          >
            <div>
              <IoShareSocialOutline size={24} />
            </div>
            <div>Share</div>
          </div>
          {/* Download button */}
          {/* <div className="flex flex-col gap-1 text-xs items-center">
            <div>
              <MdOutlineFileDownload size={24} />
            </div>
            <div>Download</div>
          </div> */}
        </div>

        {/* Connect button */}
        <div className="bg-blue-400 rounded text-sm uppercase font-medium p-2 text-white flex items-center">
          Connect
        </div>
      </div>

      {/* content */}
      <div className="mx-10 flex flex-col gap-6 leading-8 py-4">
        <div>
          <span className="font-semibold">
            {" "}
            Revolutionizing AI with Sparse Computation :{" "}
          </span>
          Explore how ThirdAI leverages sparse computation to enhance AI
          efficiency, significantly reducing computational costs and energy
          consumption while maintaining high accuracy, making AI more accessible
          and sustainable for various applications.
        </div>

        <div>
          <span className="font-semibold">
            {" "}
            Revolutionizing AI with Sparse Computation :{" "}
          </span>
          Explore how ThirdAI leverages sparse computation to enhance AI
          efficiency, significantly reducing computational costs and energy
          consumption while maintaining high accuracy, making AI more accessible
          and sustainable for various applications.
        </div>

        <div>
          <span className="font-semibold">
            {" "}
            Revolutionizing AI with Sparse Computation :{" "}
          </span>
          Explore how ThirdAI leverages sparse computation to enhance AI
          efficiency, significantly reducing computational costs and energy
          consumption while maintaining high accuracy, making AI more accessible
          and sustainable for various applications.
        </div>
      </div>
    </div>
  );
};

export default page;
