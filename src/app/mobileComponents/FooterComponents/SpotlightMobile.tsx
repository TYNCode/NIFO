import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiArrowDownCircle } from "react-icons/fi";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";

const SpotlightMobile = ({ activeSpotlight, setActiveSpotlight }) => {
  // Helper function to format the date
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

  // State to store the formatted date
  const [cdate, setCDate] = useState(getFormattedDate());

  // Updating date on component mount (if needed in the future for live updates)
  useEffect(() => {
    const interval = setInterval(() => {
      setCDate(getFormattedDate());
    }, 1000 * 60 * 60 * 12);

    return () => clearInterval(interval);
  }, []);

  const renderSpotlightFirst = () => {
    return (
      <div className="flex flex-col justify-around gap-6 py-7 items-start mx-7 text-lg">
        <div className="font-medium text-xl">SPOTLIGHT</div>
        {/* Spotlight video */}
        <div className="flex flex-col gap-4">
          <div>
            <Image
              src="/thirdai-mobile.png"
              width={500}
              height={500}
              alt="spotlight"
            />
          </div>
          <div className="font-light text-sm">{cdate}</div>
        </div>
        {/* Spot light title */}
        <div className="leading-9 tracking-wide line-clamp-4">
          How ThirdAI revolutionizes AI with sparse computing, enabling
          efficient, cost-effective deep learning on standard CPUs, driving AI
          accessibility and deployment trends
        </div>

        {/* Downbutton */}
        <div
          className="text-gray-700 flex items-center justify-center mx-auto cursor-pointer"
          onClick={handleSpotlight}
        >
          <FiArrowDownCircle size={30} />
        </div>
      </div>
    );
  };

  const renderSpotlightSecondPage = () => {
    return (
      <div>
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
            <div className="flex flex-col gap-1 text-xs items-center">
              <div>
                <IoShareSocialOutline size={24} />
              </div>
              <div>Share</div>
            </div>
            {/* Download button */}
            <div className="flex flex-col gap-1 text-xs items-center">
              <div>
                <MdOutlineFileDownload size={24} />
              </div>
              <div>Download</div>
            </div>
          </div>

          {/* Connect button */}
          <div className="bg-blue-400 rounded text-sm uppercase font-medium p-2 text-white flex items-center">
            Connect
          </div>
        </div>

        {/* content */}
        <div className="mx-10 flex flex-col gap-6 leading-8 py-4">
           <div>
           <span className="font-semibold"> Revolutionizing AI with Sparse Computation : </span> 
          Explore how ThirdAI
          leverages sparse computation to enhance AI efficiency, significantly
          reducing computational costs and energy consumption while maintaining
          high accuracy, making AI more accessible and sustainable for various
          applications. 
           </div>

           <div>
           <span className="font-semibold"> Revolutionizing AI with Sparse Computation : </span> 
          Explore how ThirdAI
          leverages sparse computation to enhance AI efficiency, significantly
          reducing computational costs and energy consumption while maintaining
          high accuracy, making AI more accessible and sustainable for various
          applications. 
           </div>

           <div>
           <span className="font-semibold"> Revolutionizing AI with Sparse Computation : </span> 
          Explore how ThirdAI
          leverages sparse computation to enhance AI efficiency, significantly
          reducing computational costs and energy consumption while maintaining
          high accuracy, making AI more accessible and sustainable for various
          applications. 
           </div>
        </div>
      </div>
    );
  };

  const handleSpotlight = () => {
    setActiveSpotlight(true);
  };

  return (
    <div>
      {activeSpotlight ? renderSpotlightSecondPage() : renderSpotlightFirst()}
    </div>
  );
};

export default SpotlightMobile;
