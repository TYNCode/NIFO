import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavbarTrend: React.FC = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/");
  };

  return (
    <div className="w-full relative z-50">
      <div className="shadow-md">
        <Image
          src="/nifoimage.png"
          alt="Nifo Logo"
          width={100}
          height={100}
          className="w-24 cursor-pointer"
          onClick={handleRoute}
        />
      </div>
    </div>
  );
};

export default NavbarTrend;
