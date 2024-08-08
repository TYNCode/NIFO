import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdFeedback } from "react-icons/md";

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
};

export default NavBar;
