import React from "react";
import { useRouter } from "next/navigation";

const NavBarCoin: React.FC = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-14 right-0 bg-white z-10 shadow-md">
      <div className="p-4">
        <img
          src="/nifoimage.png"
          alt="Nifo Logo"
          className="w-20 cursor-pointer"
          onClick={handleRoute}
        />
      </div>
    </div>
  );
};

export default NavBarCoin;
