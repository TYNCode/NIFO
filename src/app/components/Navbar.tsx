import React, { useState } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoTrendingUpSharp } from "react-icons/io5";
interface NavbarProps {
  open: boolean;
  handleToggleLeftFrame: () => void;
}

const NavBar: React.FC<NavbarProps> = ({ open, handleToggleLeftFrame }) => {
  const router = useRouter();
  const handleTrendsRoute = () => {
    router.push("/trends");
  };
    return (
        <div
            className={`flex bg-white items-center flex-col gap-8  cursor-pointer transition-all`}
        >
            {open ? (
                <div
                    className={`${open ? '' : 'hidden'}`}
                    onClick={handleToggleLeftFrame}>
                    <div>
                        <IoIosArrowBack size={23} />
                    </div>
                </div>
            ) : (
                <div
                    className={`${!open ? '' : 'hidden'}`}
                    onClick={handleToggleLeftFrame}>
                    <IoIosArrowForward size={23} />
                </div>
            )}
            <div className="hover:text-blue-500" onClick={handleTrendsRoute}>
              <IoTrendingUpSharp size={23}/>
            </div>

        </div>
    );
};

export default NavBar;
