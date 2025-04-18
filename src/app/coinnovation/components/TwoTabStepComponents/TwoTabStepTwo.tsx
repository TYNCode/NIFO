import React from "react";
import { useSelector } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "./Button";
import { MdDeleteOutline } from "react-icons/md";
import { RiAddCircleLine } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";
import { RootState } from "../../../redux/store";
import { useAppDispatch } from "../../../redux/hooks";
import { setActiveTabSource } from "../../../redux/features/source/solutionProviderSlice";
import { ClipLoader } from "react-spinners";

interface StarRatingProps {
  rating: number;
}

const parameters = [
  "Customer Feedback",
  "Potential Client Fit",
  "Deployment Capability",
  "Channel Partner Network",
  "Unique Selling Proposition (USP)",
  "IP Protection Strength",
  "Competitor Benchmarking",
  "Funding Stage & Stability",
  "Incorporation Timeline (experience)",
  "Product Maturity Stage",
  "Team Strength",
];

const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
  <div className="flex gap-1 justify-center">
    {[...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </span>
    ))}
  </div>
);

const TwoTabStepTwo: React.FC = () => {
  const {
    result: comparisonResult,
    loading,
    error,
  } = useSelector((state: RootState) => state.solutionComparison);

  const dispatch = useAppDispatch();

  const getRatingArray = (
    criteria: Record<string, { score: number }>
  ): number[] => {
    return parameters.map((param) => criteria[param]?.score ?? 0);
  };

  const handleBackButton = () => {
    console.log("Back button clicked");
    dispatch(setActiveTabSource("02.a"));
  };

  console.log("comparison results", comparisonResult)

  return (
    <div className="p-6 rounded-lg shadow-md">
      {loading && (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#3B82F6" size={40} />
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && comparisonResult.length > 0 && (
        <table className="w-full border-collapse bg-white border border-gray-200 text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border border-gray-300">Parameters</th>
              {comparisonResult.map((company:any) => (
      
                <th
                  key={company?.company}
                  className="p-3 border border-gray-300"
                >
                  {company?.company}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, rowIndex) => (
              <tr key={rowIndex} className="border border-gray-300">
                <td className="p-3 border border-gray-300">{param}</td>
                {comparisonResult.map((company: any) => {
                  const ratings = getRatingArray(company?.criteria);
                  console.log("ratingsssss", company);
                  return (
                    <td
                      key={`${company.solution_provider_name}-${rowIndex}`}
                      className="p-3 border border-gray-300 text-center"
                    >
                      <StarRating rating={ratings[rowIndex]} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <Button
          label="Back"
          icon={<IoChevronBack />}
          onClick={() => handleBackButton()}
        />
        {/* <Button label="Add" icon={<RiAddCircleLine />} />
        <Button label="Delete" icon={<MdDeleteOutline />} /> */}
      </div>
    </div>
  );
};

export default TwoTabStepTwo;
