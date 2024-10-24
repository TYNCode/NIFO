import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsInfoCircle } from "react-icons/bs";

const ChatWindow: React.FC = () => {
    const messages = [
        { sender: "Kissflow", message: "Need platforms for developing a low code no code tool" },
        { sender: "Third AI", message: "I need to use AI platform in my CPU" },
        { sender: "Jane", message: "Hi! How can I help you?" },
    ];

    return (
        <>
            <div className='text-sm py-3 flex gap-3 items-center justify-start px-2 text-gray-400 font-semibold opacity-50'>
                <div>
                Chat Window
                </div>

                <div className='text-blue-400 cursor-pointer' title={`This is only a mock screen ,will be launching soon!`}>
                <BsInfoCircle  size={16}/>
                </div>
            </div>
            <div>
                {messages.map((message, index) => (
                    <div className='border bg-gray-100 flex flex-row items-center py-3 cursor-pointer opacity-40
                    ' key={index}>
                        <div className=''>
                            <FaUserCircle className=" h-10 w-10" />
                        </div>
                        <div className='overflow-hidden flex flex-col ml-1.5 text-black'>
                            <div className='mt-1 text-sm font-medium '>{message.sender}</div>
                            <div className='text-[13px] whitespace-nowrap font-light'>{message.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ChatWindow;
