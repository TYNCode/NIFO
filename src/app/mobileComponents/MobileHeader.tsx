"use client";

import React from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onMenuToggle,
  showMenuButton = true,
}) => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="relative sm:hidden block">
      <div className="fixed top-0 left-0 w-full h-16 border-b shadow-md bg-white z-[100] flex items-center justify-between px-4">
        {/* Left: Hamburger Menu */}
        <div className="flex items-center">
          {showMenuButton && onMenuToggle ? (
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Open menu"
            >
              <FaBars className="text-xl" />
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Center: Logo */}
        <div
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer z-20"
          onClick={handleLogoClick}
        >
          <Image
            src="/nifo.svg"
            width={100}
            height={100}
            alt="Tyn Logo"
            className="h-10 w-auto pointer-events-none"
          />
        </div>

        {/* Right: Spacer */}
        <div className="w-8" />
      </div>

      {/* Spacer to push content below fixed header */}
      <div className="h-16" />
    </header>
  );
};

export default MobileHeader;
