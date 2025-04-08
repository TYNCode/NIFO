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

interface StarRatingProps {
  rating: number;
}

const parameters = [
  "Customer Feedback",
  "No. of Potential Clients",
  "Solution Deployment Capabilities",
  "Channel Partners",
  "Product Differentiation / USP",
  "Patents / IP Protection",
  "Competitor Benchmarking",
  "Funding Stage",
  "Incorporation Timeline",
  "Product Stage",
  "Team Strength",
];

const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
  <div className="flex gap-1 justify-center">
    {[...Array(10)].map((_, index) => (
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
  const { result: comparisonResult, loading, error } = useSelector(
    (state: RootState) => state.solutionComparison
  );

  const dispatch = useAppDispatch();

  const getRatingArray = (company: any): number[] => {
    return [
      company.customer_feedback_rating,
      company.potential_clients_rating,
      company.deployment_capability_rating,
      company.channel_partners_rating,
      company.usp_rating,
      company.ip_protection_rating,
      company.competitors_benchmarking_rating,
      company.funding_stage_rating,
      company.incorporation_timeline_rating,
      company.product_stage_rating,
      company.team_strength_rating,
    ];
  };

  const handleBackButton = ()=> {
    console.log("Back button clicked");
    dispatch(setActiveTabSource('02.a'));
  }

  return (
    <div className="p-6 rounded-lg shadow-md">
      {loading && <p>Loading comparison data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && comparisonResult.length > 0 && (
        <table className="w-full border-collapse bg-white border border-gray-200 text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border border-gray-300">Parameters</th>
              {comparisonResult.map((company) => (
                <th key={company.solution_provider_name} className="p-3 border border-gray-300">
                  {company.solution_provider_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, rowIndex) => (
              <tr key={rowIndex} className="border border-gray-300">
                <td className="p-3 border border-gray-300">{param}</td>
                {comparisonResult.map((company) => {
                  const ratings = getRatingArray(company);
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
        <Button label="Back" icon={<IoChevronBack />} onClick={()=>handleBackButton()} />
        {/* <Button label="Add" icon={<RiAddCircleLine />} />
        <Button label="Delete" icon={<MdDeleteOutline />} /> */}
      </div>
    </div>
  );
};

export default TwoTabStepTwo;
