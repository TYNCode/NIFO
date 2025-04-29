import React, { useState } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FcIdea } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { IoTrendingUpSharp } from "react-icons/io5";

interface NavbarCoinnovationProps {

}

const NavbarCoinnovation: React.FC<NavbarCoinnovationProps> = () => {
    const router = useRouter();
    const handleTrendsRoute = () => {
        router.push("/trends");
    };
    const handleCoinnovationRoute = () => {
        router.push('/coinnovation')
    }
    return (
        <div
            className={`flex bg-white items-center flex-col gap-8  cursor-pointer transition-all`}
        >
            {open ? (
                <div>
                    <div>
                        <IoIosArrowBack size={23} />
                    </div>
                </div>
            ) : (
                <div>
                    <IoIosArrowForward size={23} />
                </div>
            )}
            {/* <div className="hover:text-blue-500" onClick={handleTrendsRoute}>
                <IoTrendingUpSharp size={23} />
            </div> */}
            {/* <div className="hover:text-blue-500" onClick={handleCoinnovationRoute}>
                <FcIdea size={23} />
            </div> */}
        </div>
    );
};

export default NavbarCoinnovation;
