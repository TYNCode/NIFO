import Image from 'next/image';
import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoPerson } from 'react-icons/io5';
import { LuArrowLeftRight } from 'react-icons/lu';


const NavBar: React.FC = () => {
    return (
        <div className="py-5 px-6 flex items-center justify-between bg-white shadow-md z-10">
            <Image
                src='/nifo.svg'
                alt='The Yellow Network'
                height={60}
                width={60}
            />
        </div>
    );
};

export default NavBar;
