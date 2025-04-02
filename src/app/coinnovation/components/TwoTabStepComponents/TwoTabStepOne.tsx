import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolutionProviders } from "../../../redux/features/source/solutionProviderSlice"; // import the thunk
import { FaRegFileAlt } from "react-icons/fa";
import Button from "./Button";
import CompanyCard from "./CompanyCard";
import { RiAddCircleLine } from "react-icons/ri";
import SolutionProviderForm from "./AddCompanyComponent/SolutionProviderForm";
import { AppDispatch } from "../../../redux/store";

interface SolutionProvider {
  solution_provider_id: string;
  solution_provider_name: string;
  relevant_usecase: string;
  key_customers: string[];
}

const TwoTabStepOne: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { solutionProviders, loading, error } = useSelector(
    (state: {
      solutionProvider: {
        solutionProviders: SolutionProvider[];
        loading: boolean;
        error: string | null;
      };
    }) => state.solutionProvider
  );
  const [selectedCompanies, setSelectedCompanies] = React.useState<number>(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchSolutionProviders());
  }, [dispatch]);

  const handleSelection = (selected: boolean) => {
    setSelectedCompanies((prev) => (selected ? prev + 1 : prev - 1));
  };

  return (
    <div className="w-full mx-auto p-6">
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="flex mb-4 font-semibold text-lg">
        <p className="w-[16%] ml-4">Company Name</p>
        <p className="w-[51%]">Relevant Usecase</p>
        <p className="">Key Customers</p>
      </div>

      {solutionProviders.map((company, index) => (
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
};

export default TwoTabStepOne;
