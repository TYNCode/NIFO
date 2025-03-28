import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Badge from "./Badge";
import ContactDetails from "./ContactDetails";
import { FiEdit2 } from "react-icons/fi";

interface CompanyCardProps {
  company: {
    name: string;
    relevantUsecase: string;
    keyCustomers: string[];
    products?: string;
    partnerships?: string[];
    usp?: string;
    otherUsecases?: string[];
    contact?: {
      website: string;
      email: string;
      phone: string;
      linkedin: string;
    };
  };
  onSelect: (selected: boolean) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            onChange={(e) => onSelect(e.target.checked)}
          />
          <h3 className="text-base font-semibold text-[#0071C1]">
            {company.name}
          </h3>
        </div>

        <p className="text-sm text-gray-700 mt-2">{company.relevantUsecase}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {company.keyCustomers.map((customer, index) => (
            <Badge key={index} text={customer} />
          ))}
        </div>

        <div className="flex gap-x-6">
          <button className="text-[#2286C0] hover:text-red-500">
            <RiDeleteBin6Line className="w-4 h-4" />
          </button>

          <button className=" text-[#2286C0] hover:text-green-500">
            <FiEdit2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            {isOpen ? (
              <FaChevronUp
                className="w-4 h-4 text-[#2286C0]"
                onClick={() => setIsOpen(!isOpen)}
              />
            ) : (
              <FaChevronDown
                className="w-4 h-4 text-[#2286C0]"
                onClick={() => setIsOpen(!isOpen)}
              />
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 border-t">
          {company.products && (
            <p className="text-sm">
              <strong>Products/Services Offered:</strong> {company.products}
            </p>
          )}

          {company.partnerships && (
            <p className="text-sm mt-2">
              <strong>Partnerships & Alliances:</strong>{" "}
              {company.partnerships.join(", ")}
            </p>
          )}

          {company.usp && (
            <p className="text-sm mt-2">
              <strong>Unique Selling Proposition (USP):</strong> {company.usp}
            </p>
          )}

          {company.otherUsecases && (
            <ul className="list-disc list-inside text-sm mt-2">
              {company.otherUsecases.map((usecase, index) => (
                <li key={index}>{usecase}</li>
              ))}
            </ul>
          )}

          {company.contact && <ContactDetails contact={company.contact} />}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
