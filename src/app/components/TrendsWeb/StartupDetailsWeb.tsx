import React from "react";
import { BiLink, BiPhone, BiSend } from "react-icons/bi";
import { BsLinkedin } from "react-icons/bs";

const StartupDetailsWeb = ({ selectedEcosystem }) => {
  return (
    <div className="w-[340px] min-h-[600px] flex justify-center items-center ">
      <div className=" bg-white flex flex-col gap-4 justify-center items-center shadow-lg overflow-auto">
        <div className="bg-blue-800 px-2 py-3 flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 text-white">
              <div>
                <BsLinkedin size={23} />
              </div>
              <div>
                <BiLink size={23} />
              </div>
              <div>
                <BiPhone size={23} />
              </div>
            </div>
            <div className="bg-blue-500 text-white flex gap-4 px-3 py-1 rounded-md justify-center items-center">
              <div>Connect</div>
              <div>
                <BiSend />
              </div>
            </div>
          </div>
          <div className="text-base text-white ">
            Kissflow is a cloud-based workflow and project management software
            designed for automating business processes and optimizing
            organizational efficiency.
          </div>
        </div>
        <div className="flex flex-col gap-4 px-2 pb-6 overflow-y-auto">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2 col-span-1">
              <div className="font-semibold text-xl">Analyst Rated</div>
              <div className="font-light">Gartner</div>
            </div>
            <div className="flex flex-col font-semibold col-span-1">
              <div className="font-semibold text-xl">Customers</div>
              <div className="font-light">Walmart, Vodaphone & HSBC</div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2 col-span-1">
              <div className="font-semibold text-xl">Industry</div>
              <div className="font-light">Gartner</div>
            </div>
            <div className="flex flex-col gap-2 font-semibold col-span-1">
              <div className="font-semibold text-xl">Technology</div>
              <div className="font-light">Walmart, Vodaphone & HSBC</div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-2 col-span-1">
              <div className="font-semibold text-xl">Country</div>
              <div className="font-light">USA</div>
            </div>
            <div className="flex flex-col font-semibold col-span-1">
              <div className="font-semibold text-xl">Company Stage</div>
              <div className="font-light">Series B+</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-xl">Solutions</div>
            <div className="font-light">USA</div>
          </div>
          <div className="flex flex-col font-semibold col-span-1">
            <div className="font-semibold text-xl">Description</div>
            <div className="font-light">Series B+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailsWeb;
