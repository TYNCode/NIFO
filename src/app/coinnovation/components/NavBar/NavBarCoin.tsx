import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NavBarCoin: React.FC = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-14 right-0 bg-white z-10 shadow-md">
      <div className="p-4">
        <Image
          src="/nifoimage.png"
          alt="Nifo Logo"
          width={100}
          height={100}
          className="w-20 cursor-pointer"
          onClick={handleRoute}
        />
      </div>
    </div>
  );
};

export default NavBarCoin;
