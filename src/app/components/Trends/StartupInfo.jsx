import React from 'react'
import { BsLinkedin } from 'react-icons/bs'
import { CiLink, CiLinkedin } from 'react-icons/ci';
import { MdPhone } from 'react-icons/md';

const StartupInfo = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className="flex flex-row bg-[#005585] gap-4 p-4 items-center justify-center ">
        <div className="">
          <img src="/kissflow.png" alt="Kissflow" />
        </div>
        <div className="flex flex-col gap-3 text-white">
          <div className="flex flex-row gap-8">
            <div>
              <BsLinkedin size={24} />
            </div>
            <div>
              <CiLink size={24} />
            </div>
            <div>
              <MdPhone size={24} />
            </div>
          </div>
          <div className="">
            Kissflow is a cloud-based workflow and project management software
            designed for automating business processes and optimizing
            organizational efficiency.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mx-4">
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <div className="font-semibold">Analyst Rated</div>
            <div>Gartner</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Customers</div>
            <div>Walmart, Vodafone & HSBC</div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <div className="font-semibold">Industry</div>
            <div>Quantum Computing, Enterprise Software</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Technology</div>
            <div>
              Quantum Computing, Algorithm Optimization, Machine Learning
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <div className="font-semibold">Country</div>
            <div>USA</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Company Stage</div>
            <div>Series B+</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">Solutions</div>
          <div>
            Facilitates algorithm implementations and execution on quantum
            hardware, offering unmatched efficiency in problem-solving.
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">Description</div>
          <div>
            Provides cutting-edge quantum computing software, tackling complex
            problems more sufficiently than ever.
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartupInfo
