import React, { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Badge from "./Badge";
import { FiEdit2 } from "react-icons/fi";
import IconButton from "./IconButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolutionProviderDetails } from "../../../redux/features/source/solutionProviderDetailsSlice";
import { AppDispatch, RootState } from "../../../redux/store";

interface CompanyCardProps {
  company: {
    solution_provider_name: string;
    relevant_usecase: string;
    key_customers: string[];
    solution_provider_id: string;
  };
  onSelect: (selected: boolean) => void;
  project_id: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onSelect,
  project_id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { details, loading, error } = useSelector(
    (state: RootState) => state.solutionProviderDetails
  );

  useEffect(() => {
    if (isOpen && !details) {
      dispatch(
        fetchSolutionProviderDetails({
          project_id,
          solution_provider_id: company.solution_provider_id,
        })
      );
    }
  }, [isOpen, dispatch, company.solution_provider_id, project_id, details]);

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
          {loading && <p>Loading provider details...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {details && (
            <>
              <p className="text-sm">
                <div className="font-bold mb-1">Key Customer:</div>
                <div>{details.key_customer}</div>
              </p>
              <p className="text-sm">
                <div className="font-bold mb-1">USP:</div>
                <div>{details.usp}</div>
              </p>
              <p className="text-sm">
                <div className="font-bold mb-1">Email:</div>
                <div>{details.email}</div>
              </p>
              <p className="text-sm">
                <div className="font-bold mb-1">Phone:</div>
                <div>{details.phone_number}</div>
              </p>
              <p className="text-sm">
                <div className="font-bold mb-1">Website:</div>
                <a
                  href={details.solution_provider_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {details.solution_provider_url}
                </a>
              </p>
              <p className="text-sm">
                <div className="font-bold mb-1">LinkedIn:</div>
                <a
                  href={details.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {details.linkedin_url}
                </a>
              </p>
              <div className="font-bold mb-1">Other Use Cases:</div>
              <ul className="list-disc list-inside text-sm">
                {details.other_usecases.map((usecase, index) => (
                  <li key={index}>{usecase}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
