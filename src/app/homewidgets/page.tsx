import React from 'react';
import LeftFrame from '../components/LeftFrame/LeftFrame';
import { IoIosSearch } from "react-icons/io";

interface pageProps {

}

const page: React.FC<pageProps> = (props) => {
    return (
        <div className='flex flex-row gap-4'>
            <LeftFrame />
            <div className='flex flex-col gap-4'>
                <div>
                    Welcome in , Lathiesh
                </div>
                <div className='px-4 py-4'>                
                    <div className='flex flex-col'>
                        <div>Projects</div>
                        <div className='flex bg-white rounded h-[200px] w-[480px] shadow-lg'></div>
                    </div>
                    <div className='flex flex-row gap-4 items-center shadow-md bg-white mt-4 rounded-md px-4 py-4'>
                        <div>
                            <IoIosSearch size={24}/>
                        </div>
                        <div>Search</div>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-md overflow-hidden relative w-full">
                    {/* Image */}
                    <div className="relative">
                        <img
                            src="/bg-usecase.png"
                            alt="News Image"
                            className="w-full h-48 object-cover"
                        />

                        {/* Overlay content */}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                            <div className="text-lg font-semibold">
                                The oil market has a bigger problem than a slowing China – India
                            </div>
                            <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm transition">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default page;