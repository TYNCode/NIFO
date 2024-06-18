import Image from 'next/image';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoPerson } from 'react-icons/io5';
import { LuArrowLeftRight } from 'react-icons/lu';


const NavBar: React.FC = () => {
    return (
        <div className="py-5 px-6 flex items-center justify-between bg-white shadow-md z-10">
            <Image
                src='/tyn-logo.png'
                alt='The Yellow Network'
                height={0}
                width={180}
            />
        </div>
    );
};

export default NavBar;
