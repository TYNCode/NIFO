import { FaRegFileAlt } from "react-icons/fa";
import Button from "./Button";
import CompanyCard from "./CompanyCard";
import { RiAddCircleLine } from "react-icons/ri";
import { useState } from "react";

const companies = [
  {
    name: "Devic Earth",
    relevantUsecase: "Installed Pure Skies in Bangalore Industrial Cluster...",
    keyCustomers: ["JSW Steel", "BOSCH", "ITC", "Infosys"],
    products: "Air pollution control system using radio waves",
    partnerships: ["ACC Limited"],
    usp: "Large-scale air quality improvement at low cost",
    otherUsecases: [
      "Chemical Manufacturing Plant: Achieved 66% reduction...",
      "Marathon Event: Improved air quality by 30-54%...",
    ],
    contact: {
      website: "www.company.com",
      email: "company@mail.com",
      phone: "044-4343555, +91 9962788077",
      linkedin: "company@LinkedIn.com",
    },
  },
];

export default function Home() {
  const [selectedCompanies, setSelectedCompanies] = useState<number>(0);

  const handleSelection = (selected: boolean) => {
    setSelectedCompanies((prev) => (selected ? prev + 1 : prev - 1));
  };

  return (
    <div className="w-full mx-auto p-6 ">
      <div className="flex  mb-4 font-semibold text-lg">
        <p className="ml-6">Company Name</p>
        <p className="ml-32">Relevant Usecase</p>
        <p className="ml-96">Key Customers</p>
      </div>
      {companies.map((company, index) => (
        <CompanyCard key={index} company={company} onSelect={handleSelection} />
      ))}

      <div className="flex justify-end gap-3">
        <Button label="Add" icon={<RiAddCircleLine />} />
        <Button
          label="Compare"
          icon={<FaRegFileAlt />}
          disabled={selectedCompanies === 0}
        />
      </div>
    </div>
  );
}
