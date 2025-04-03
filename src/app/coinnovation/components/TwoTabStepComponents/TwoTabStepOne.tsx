import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSolutionProviders,
  addSolutionProvider,
  setActiveTabSource,
} from "../../../redux/features/source/solutionProviderSlice";
import { FaRegFileAlt } from "react-icons/fa";
import Button from "./Button";
import CompanyCard from "./CompanyCard";
import { RiAddCircleLine } from "react-icons/ri";
import SolutionProviderForm from "./AddCompanyComponent/SolutionProviderForm";
import { AppDispatch } from "../../../redux/store";
import { compareSolutionProviders } from "../../../redux/features/source/solutionCompareSlice";

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
  const [selectedCompanyIDs, setSelectedCompanyIDs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const project_id = localStorage.getItem("projectID");
console.log("solutionProviders", solutionProviders);

  useEffect(() => {
    if (project_id) {
      dispatch(fetchSolutionProviders());
    }
  }, [dispatch, project_id]);

  const handleSelection = (selected: boolean, solution_provider_id:string) => {
    console.log("selected--->", selected);
    setSelectedCompanies((prev) => (selected ? prev + 1 : prev - 1));
    console.log("selectedCompanies", solution_provider_id);
    setSelectedCompanyIDs( 
      (prev) => 
        selected ? [...prev, solution_provider_id]: prev.filter((id)=> id !== solution_provider_id)
    )
  };

  const handleAddSolutionProvider = async (formData: any) => {
    if (!project_id) {
      console.error("Project ID is missing");
      return;
    }
    formData.project_id = project_id;
    await dispatch(addSolutionProvider(formData));
    setIsModalOpen(false);
  };

  const handleCompareClick = () => {
    dispatch(setActiveTabSource("02.b"));
    let bodyForCompare = {
      project_id, solution_provider_ids : selectedCompanyIDs
    }
    dispatch(compareSolutionProviders( bodyForCompare))
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
          onClick={handleCompareClick}
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
