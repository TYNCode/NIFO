import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "./Button";
import { MdDeleteOutline } from "react-icons/md";
import { RiAddCircleLine } from "react-icons/ri";
import { IoChevronBack } from "react-icons/io5";

interface CompanyData {
  [company: string]: number[];
}

interface StarRatingProps {
  rating: number;
}

const companies = [
  "Devic Earth",
  "Klenviron",
  "Praan Air",
  "company 4",
  "Praan ",
];

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

const initialRatings: CompanyData = {
  "Devic Earth": [4, 5, 4, 3, 4, 4, 3, 3, 2, 4, 3],
  Klenviron: [5, 5, 4, 4, 4, 5, 3, 3, 2, 4, 4],
  "Praan Air": [4, 4, 4, 3, 3, 4, 3, 3, 2, 3, 3],
  "company 4": [5, 5, 4, 4, 4, 5, 3, 3, 2, 4, 4],
  "Praan ": [4, 4, 4, 3, 3, 4, 3, 3, 2, 3, 3],
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
  <div className="flex gap-1">
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
  const [ratings, setRatings] = useState<CompanyData>(initialRatings);

  return (
    <div className=" p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse bg-white border border-gray-200 text-base">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border border-gray-300">Parameters</th>
            {companies.map((company) => (
              <th key={company} className="p-3 border border-gray-300">
                {company}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, rowIndex) => (
            <tr key={rowIndex} className="border border-gray-300">
              <td className="p-3 border border-gray-300">{param}</td>
              {companies.map((company) => (
                <td
                  key={company}
                  className="p-3 border border-gray-300 text-center"
                >
                  <StarRating rating={ratings[company][rowIndex]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end gap-3 mt-4">
        <Button label="Back" icon={<IoChevronBack />} />
        <Button label="Add" icon={<RiAddCircleLine />} />
        <Button label="Delete" icon={<MdDeleteOutline />} />
      </div>
    </div>
  );
};

export default TwoTabStepTwo;
