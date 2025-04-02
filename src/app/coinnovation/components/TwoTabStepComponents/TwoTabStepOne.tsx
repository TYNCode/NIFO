// TwoTabStepOne.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolutionProviders,
  addSolutionProvider,
} from "../../../redux/features/source/solutionProviderSlice";
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
  const [selectedCompanies, setSelectedCompanies] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const project_id = localStorage.getItem("project_id");

  useEffect(() => {
    if (project_id) {
      dispatch(fetchSolutionProviders());
    }
  }, [dispatch, project_id]);

  const handleSelection = (selected: boolean) => {
    setSelectedCompanies((prev) => (selected ? prev + 1 : prev - 1));
  };

  const handleAddSolutionProvider = async (formData: any) => {
    await dispatch(addSolutionProvider(formData));
    setIsModalOpen(false);
  };

  if (!project_id) {
    return <p style={{ color: "red" }}>Project ID is missing</p>;
  }

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
        <CompanyCard
          key={index}
          company={company}
          onSelect={handleSelection}
          project_id={project_id}
        />
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
          onAdd={handleAddSolutionProvider}
        />
      )}
    </div>
  );
};

export default TwoTabStepOne;
