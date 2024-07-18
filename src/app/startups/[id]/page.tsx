"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaAngleLeft } from 'react-icons/fa';
import { TbShare2 } from 'react-icons/tb';
import MobileHeader from '../../mobileComponents/MobileHeader';
import BottomBar from '../../mobileComponents/BottomBar';
import { useParams } from 'next/navigation';

const StartupDetails = () => {
  const [activeSpotlight, setActiveSpotlight] = useState(false);
  const [activeTab, setActiveTab] = useState('Spotlight');
  const [startupData, setStartupData] = useState(null);

  const params = useParams()
  const startupDetails = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/prompt/startups/${params.id}/`);
      setStartupData(res.data);
      console.log("ressss",res)
    } catch (error) {
      console.error('Error fetching startup details:', error);
    }
  };

  useEffect(() => {
    startupDetails();
  }, []);

  console.log("startupData",startupData)

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: startupData?.startup_name,
          text: startupData?.startup_description,
          url: window.location.href
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API not supported');
    }
  };

  return (
    <div>
      <div>
        <MobileHeader
          activeSpotlight={activeSpotlight}
          setActiveSpotlight={setActiveSpotlight}
        />
      </div>

      {/* company profile component */}
      <div className="mx-6 my-4 flex flex-col gap-2 pb-32">
      
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div className="uppercase font-medium text-blue-500 text-lg">
                  {startupData?.startup_name}
                </div>
              </div>

              <div className="flex gap-4 items-center justify-center">
                {/* Share button */}
                <div
                  className="text-gray-500 cursor-pointer"
                  onClick={handleShareClick}
                >
                  <TbShare2 size={26} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 leading-7 tracking-wide my-6 mx-3">
              <div>{startupData?.startup_description}</div>
              <div className="flex flex-col gap-4 shadow-inner text-sm bg-blue-100 p-4 rounded-lg">
                <div className="flex justify-between gap-3 w-full">
                  <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                    <div className="font-semibold">Industry</div>
                    <div>{startupData?.startup_industry}</div>
                  </div>
                  <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                    <div className="font-semibold">Technology</div>
                    <div>{startupData?.startup_technology}</div>
                  </div>
                </div>
                <div className="flex justify-between gap-3 w-full">
                  <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                    <div className="font-semibold">Country</div>
                    <div>{startupData?.startup_country}</div>
                  </div>
                  <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                    <div className="font-semibold">Funding Stage</div>
                    <div>{startupData?.startup_company_stage}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col leading-7 tracking-wide">
                <div className="font-semibold">Solution</div>
                <div>{startupData?.startup_solutions}</div>
              </div>
              <div className="flex flex-col leading-7 tracking-wide">
                <div className="font-semibold">Usecases</div>
                <div>{startupData?.startup_usecases}</div>
              </div>
            </div>
          </>
        
      </div>

      <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
    </div>
  );
};

export default StartupDetails;
