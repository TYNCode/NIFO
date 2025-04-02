import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Badge from "./Badge";
import { FiEdit2 } from "react-icons/fi";
import IconButton from "./IconButton";

interface CompanyCardProps {
  company: {
    solution_provider_name: string;
    relevant_usecase: string;
    key_customers: string[];
  };
  onSelect: (selected: boolean) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer gap-2">
        <div className="flex items-center gap-6 w-[15%]">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border-2 border-blue-400"
            onChange={(e) => onSelect(e.target.checked)}
          />
          <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-base font-semibold text-[#0071C1]">
              {company.solution_provider_name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2 w-[50%]">
          {company.relevant_usecase}
        </p>

        <div className="flex flex-wrap gap-2 mt-2 w-[20%]">
          {company.key_customers?.map((customer, index) => (
            <Badge key={index} text={customer} />
          ))}
        </div>

        <div className="flex gap-x-6 w-[10%]">
          <IconButton
            icon={<RiDeleteBin6Line />}
            color="text-[#2286C0]"
            hoverColor="hover:text-red-500"
            onClick={() => console.log("Delete clicked")}
          />

          <IconButton
            icon={<FiEdit2 />}
            color="text-[#2286C0]"
            hoverColor="hover:text-green-500"
            onClick={() => console.log("Edit clicked")}
          />

          <div className="flex items-center gap-3">
            <IconButton
              icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
              color="text-[#2286C0]"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 border-t">
          {company.key_customers && (
            <p className="text-sm">
              <div className="font-bold mb-1">Key Customers:</div>
              <div>{company.key_customers.join(", ")}</div>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
