import React, { useState } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdFeedback } from "react-icons/md";
import { useRouter } from "next/navigation";
interface NavbarProps {
  open: boolean;
  handleToggleLeftFrame: () => void;
}

const NavBar: React.FC<NavbarProps> = ({ open, handleToggleLeftFrame }) => {


    return (
        <div
            className={`flex bg-white items-center flex-row  cursor-pointer transition-all`}
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

        </div>
    );
  const router = useRouter();
  const handleTrendsRoute = () => {
    router.push("/trends");
  };
  return (
    <div
      className={`bg-white ${
        !open ? "shadow-xl" : ""
      } h-screen px-3 items-center flex-row  cursor-pointer transition-all`}
    >
      {open ? (
        <div className={`${open ? "" : "hidden"}`}>
          <div onClick={handleToggleLeftFrame}>
            <IoIosArrowBack size={23} />
          </div>
        </div>
      ) : (
        <div className={`${!open ? "" : "hidden"} flex flex-col gap-y-16`}>
          <div onClick={handleToggleLeftFrame}>
            <IoIosArrowForward size={23} />
          </div>
          <div className="text-blue-400" onClick={handleTrendsRoute}>
            <BsGraphUpArrow size={23} />
          </div>
        </div>
      )}
      {/* <div
                className='ml-8'
                onClick={handleFeedbackIconClick}>
                <MdFeedback size={23} />
            </div> */}
    </div>
  );
};

export default NavBar;
