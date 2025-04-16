import React from "react";
import { useSelector } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useAppDispatch } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setActiveTabSource } from "../../../redux/features/source/solutionProviderSlice";
import Button from "./Button";
import { FaArrowLeft } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  reason: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reason }) => (
  <div className="flex gap-2 justify-center group relative">
    {[...Array(5)].map((_, index) => (
      <span key={index}>
        {index < rating ? (
          <FaStar className="text-yellow-400" size={18} />
        ) : (
          <FaRegStar className="text-gray-300" size={18} />
        )}
      </span>
    ))}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-64 text-center">
      <div className="relative bg-blue-600 text-white text-xs rounded-md shadow-lg px-3 py-2">
        {reason}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600"></div>
      </div>
    </div>
  </div>
);

const PARAMETER_LABELS: { [key: string]: string } = {
  "Customer Feedback": "Customer Feedback",
  "Potential Client Fit": "No. of Potential Clients",
  "Deployment Capability": "Solution Deployment Capabilities",
  "Channel Partner Network": "Channel Partners",
  "Unique Selling Proposition (USP)": "Product Differentiation / USP",
  "IP Protection Strength": "Patents / IP Protection",
  "Competitor Benchmarking": "Competitor Benchmarking",
  "Funding Stage & Stability": "Funding Stage",
  "Incorporation Timeline (experience)": "Incorporation Timeline",
  "Product Maturity Stage": "Product Stage",
  "Team Strength": "Team Strength",
};

const TwoTabStepTwo: React.FC = () => {
  const {
    result: comparisonResult,
    loading,
    error,
  } = useSelector((state: RootState) => state.solutionComparison);
  const dispatch = useAppDispatch();
  const handleBackButton = () => {
    dispatch(setActiveTabSource("02.a"));
  };

  console.log("compare result =>", comparisonResult);
  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader color="#3B82F6" size={40} />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : comparisonResult.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No companies selected for comparison.
        </div>
      ) : (
        comparisonResult.length > 0 && (
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border border-gray-300">Parameters</th>
                {comparisonResult.map((company) => (
                  <th
                    key={company.company}
                    className="p-3 border border-gray-300 text-center"
                  >
                    {company.company}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(PARAMETER_LABELS).map(([key, label]) => (
                <tr key={key} className="border border-gray-300">
                  <td className="p-3 border border-gray-300">{label}</td>
                  {comparisonResult.map((company) => {
                    const ratingObj = company.criteria?.[key];
                    const rating = ratingObj?.score ?? 0;
                    const reason =
                      ratingObj?.reason ??
                      "No data available for this parameter";
                    return (
                      <td
                        key={`${company.company}-${key}`}
                        className="p-3 border border-gray-300 text-center"
                      >
                        <StarRating rating={rating} reason={reason} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      <div className="mt-3 flex justify-end mr-3">
        <Button
          label={"Back"}
          icon={<FaArrowLeft />}
          onClick={handleBackButton}
        ></Button>
      </div>
    </div>
  );
};

export default TwoTabStepTwo;
