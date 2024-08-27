import React, { Suspense } from 'react';
import { Card, Button, Spinner } from "flowbite-react"; // Import Spinner component
import Link from 'next/link';
import { FaLink, FaLocationDot } from "react-icons/fa6";

interface Company {
  startup_id: number;
  startup_name: string;
  startup_description: string;
  startup_url: string;
  startup_country: string;
}

interface CompanyListProps {
  viewType: "card" | "list";
  companies: Company[];
  lastCompanyElementRef?: (node: HTMLElement) => void;
  isLoading: boolean; 
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const CompanyList: React.FC<CompanyListProps> = ({ viewType, companies = [], lastCompanyElementRef ,isLoading}) => {
  return (
    <div>
      { viewType === "card" ? (
        <div className="card-view">
          <div className={`flex gap-6 flex-wrap  ${companies.length % 3 === 0 ? 'justify-center' : 'ml-[10%] justify-start'}`}>
            {companies.map((company, index) => ( 
              <div
                key={company.startup_id}
                className="w-[100%] md:w-[48%] lg:w-[28%]  "
                ref={companies.length === index + 1 ? lastCompanyElementRef : null}
              >
                  <Card className="h-[260px] relative hover:border hover:border-[#4dabf7] hover:border-1 ">
                    <h5 className="h-[20%] text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      {truncateText(company.startup_name, 20)}
                    </h5>
                    <p className="h-[50%] font-normal text-gray-700 dark:text-gray-400 text-sm line-clamp-3">
                      {truncateText(company.startup_description, 100)}
                    </p>
                    <div className='h-[20%] flex justify-between text-[14px]'>
                      <div className='flex gap-1 items-center'>
                        <FaLocationDot />
                        {company.startup_country}
                      </div>
                      <a href={company.startup_url} target="_blank" rel="noopener noreferrer" className='hover:text-[#228be6] flex items-center gap-1'>
                        <FaLink />
                        <p>Website</p>
                      </a>
                    </div>
                    <Button className="bg-[#4dabf7] hover:!bg-[#228be6] focus:!outline-none">Connect</Button>
                  </Card>
              </div>
            ))}
            {isLoading && (
              <div className="w-full flex justify-center py-4">
                <Spinner aria-label="Loading spinner" size="lg"  />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="list-view mt-10">
          {companies.map((company, index) => (
            <Link href={`/profile/${company.startup_id}`} key={company.startup_id}>
              <div
                className="flex flex-row items-center gap-4 bg-white p-6 rounded-lg shadow-sm mb-4 border hover:border hover:border-[#22b8cf] cursor-pointer"
                ref={companies.length === index + 1 ? lastCompanyElementRef : null} 
              >
                <div className="flex-1">
                  <h5 className="sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white hidden sm:block">
                    {truncateText(company.startup_name, 30)}
                  </h5>
                  <h5 className="sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white block sm:hidden">
                    {truncateText(company.startup_name, 10)}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400 text-sm sm:block hidden">
                    {truncateText(company.startup_description, 80)}
                  </p>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <div className="flex items-center gap-2">
                    <FaLocationDot />
                    {company.startup_country}
                  </div>
                  <a href={company.startup_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#22b8cf] flex items-center gap-1">
                    <FaLink />
                    <p>Website</p>
                  </a>
                </div>
              </div>
            </Link>
          ))}
          {isLoading && (
            <div className="w-full flex justify-center py-4">
              <Spinner aria-label="Loading spinner" size="lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyList;
