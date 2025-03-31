import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Badge from "./Badge";
import { FiEdit2 } from "react-icons/fi";
import IconButton from "./IconButton";
import ContactIcon from "./ContactIcon";

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
      <div className="flex items-center justify-between cursor-pointer gap-2">
        <div className="flex items-center gap-6 w-[15%]">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border-2 border-blue-400"
            onChange={(e) => onSelect(e.target.checked)}
          />
          <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-base font-semibold text-[#0071C1]">
              {company.name}
            </h3>
            <div className="flex space-x-3">
              <ContactIcon type="website" link="https://example.com" />
              <ContactIcon type="email" link="mailto:example@example.com" />
              <ContactIcon type="phone" link="tel:+1234567890" />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2 w-[50%]">
          {company.relevantUsecase}
        </p>

        <div className="flex flex-wrap gap-2 mt-2 w-[20%]">
          {company.keyCustomers.map((customer, index) => (
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
          {company.products && (
            <p className="text-sm">
              <div className="font-bold mb-1">Products/Services Offered</div>
              <div>{company.products}</div>
            </p>
          )}

          {company.partnerships && (
            <p className="text-sm mt-4 *:">
              <div className="font-bold mb-1">Partnerships & Alliances:</div>
              <div>{company.partnerships.join(", ")}</div>
            </p>
          )}

          {company.usp && (
            <p className="text-sm mt-4">
              <div className="font-bold mb-1">
                Unique Selling Proposition (USP):
              </div>
              <div>{company.usp}</div>
            </p>
          )}

          {company.otherUsecases && (
            <ul className="list-disc list-inside text-sm mt-4">
              <div className="font-bold mb-1">Other Usecases:</div>
              {company.otherUsecases.map((usecase, index) => (
                <li key={index}>{usecase}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
