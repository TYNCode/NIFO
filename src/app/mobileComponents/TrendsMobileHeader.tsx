import React from "react";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const TrendsMobileHeader = ({ handleBack }) => {
  const router = useRouter();

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full h-16 border-b shadow-md bg-white z-50 flex items-center justify-between px-4">
        {/* Left Arrow */}
        <div
          className="text-gray-700 cursor-pointer"
          onClick={handleBack} // Trigger the back function when clicked
          role="button"
          aria-label="Go back"
        >
          <FaAngleLeft size={24} />
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/nifoimage.png" width={100} height={100} alt="Tyn Logo" />
        </div>

        {/* Right Placeholder for balance */}
        <div className="w-8"></div>
      </div>
    </div>
  );
};

export default TrendsMobileHeader;