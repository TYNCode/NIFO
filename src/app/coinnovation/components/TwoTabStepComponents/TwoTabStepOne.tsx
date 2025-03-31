import { FaRegFileAlt } from "react-icons/fa";
import Button from "./Button";
import CompanyCard from "./CompanyCard";
import { RiAddCircleLine } from "react-icons/ri";
import { useState } from "react";
import SolutionProviderForm from "./AddCompanyComponent/SolutionProviderForm";

const companies = [
  {
    name: "Devic Earth",
    relevantUsecase:
      "Galvanization or galvanizing is the process of applying a protective coating to steel or iron, to prevent rusting. The most common method of galvanization is hot-dip galvanizing, in which the parts are submerged in a bath of molten hot zinc. We have a continuous hot-dip galvanization setup for producing galvanized iron (GI) wires. The wire diameters range from 1.4 - 5 mm and corresponding zinc coating range from 50 - 300 gsm i.e. 7 to 50 microns.",
    keyCustomers: [
      "JSW Steel",
      "BOSCH",
      "ITC",
      "Infosys",
      "TCS",
      "Cognizant",
      "Accenture",
    ],
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
  {
    name: "Devic Earth",
    relevantUsecase: "Installed Pure Skies in Bangalore Industrial Cluster...",
    keyCustomers: ["JSW Steel", "BOSCH", "ITC", "Infosys"],
    products: "Air pollution control system using radio waves",
    partnerships: ["ACC Limited", "TCS"],
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

export default function TwoTabStepOne() {
  const [selectedCompanies, setSelectedCompanies] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelection = (selected: boolean) => {
    setSelectedCompanies((prev) => (selected ? prev + 1 : prev - 1));
  };

  return (
    <div className="w-full mx-auto p-6 ">
      <div className="flex mb-4 font-semibold text-lg">
        <p className="w-[16%] ml-4">Company Name</p>
        <p className="w-[51%]">Relevant Usecase</p>
        <p className="">Key Customers</p>
      </div>
      {companies.map((company, index) => (
        <CompanyCard key={index} company={company} onSelect={handleSelection} />
      ))}

      <div className="flex justify-end gap-3">
        <Button
          label="Add"
          icon={<RiAddCircleLine />}
          onClick={() => setIsModalOpen(true)}
        />
        <Button
          label="Compare"
          icon={<FaRegFileAlt />}
          disabled={selectedCompanies < 2}
        />
      </div>

      {isModalOpen && (
        <SolutionProviderForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
