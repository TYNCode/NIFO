import React, { useState, useEffect } from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaLinkedin,
} from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

import Badge from "./Badge";
import IconButton from "./IconButton";
import EditSolutionProviderForm from "./EditCompanyComponent/EditSolutionProviderForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import {
  fetchSolutionProviderDetails,
  updateSolutionProvider,
} from "../../../redux/features/source/solutionProviderDetailsSlice";
import { deleteSolutionProvider } from "../../../redux/features/source/solutionProviderSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

interface CompanyCardProps {
  company: {
    solution_provider_name: string;
    relevant_usecase: string;
    key_customers: string[];
    solution_provider_id: string;
  };
  onSelect: (selected: boolean, solution_provider_id: string) => void;
  onDelete: (solution_provider_id: string) => void;
  project_id: string;
  selectedCompanies: any;
}

const ContactBadge: React.FC<{
  icon: React.ReactNode;
  text: string;
  href?: string;
}> = ({ icon, text, href }) => (
  <a
    href={href || "#"}
    target={href ? "_blank" : "_self"}
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-3 py-1 text-sm text-[#0071C1] rounded-xl mb-2 bg-[#E3F2FE] break-all"
  >
    {icon}
    {text}
  </a>
);

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onSelect,
  onDelete,
  project_id,
  selectedCompanies,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useAppDispatch();
  const projectID = useAppSelector((state) => state.projects.projectID);
  const solutionProviders = useAppSelector(
    (state) => state.solutionProvider.solutionProviders
  );

  const {
    data: details,
    loading,
    error,
  } =
    useAppSelector(
      (state) => state.solutionProviderDetails[company.solution_provider_id]
    ) || {
      loading: false,
      error: null,
      data: null,
    };

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

  const handleUpdate = (updatedData: any) => {
    dispatch(
      updateSolutionProvider({
        project_id: projectID,
        solution_provider_id: company.solution_provider_id,
        updatedData,
      })
    );
  };

  const formatUseCases = (usecases: string[]) =>
    usecases.map((uc, idx) => {
      try {
        const parsed = JSON.parse(uc.replace(/'/g, '"'));
        return (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{parsed.industry}:</span> {parsed.impact}
          </li>
        );
      } catch {
        return <li key={idx}>{uc}</li>;
      }
    });

  const handleEditClick = () => {
    setEditOpen(true);
    if (!details) {
      setLoadingEdit(true);
      dispatch(
        fetchSolutionProviderDetails({
          project_id,
          solution_provider_id: company.solution_provider_id,
        })
      ).finally(() => setLoadingEdit(false));
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(
      deleteSolutionProvider({
        project_id,
        solution_provider_id: company.solution_provider_id,
      })
    );
    onDelete(company.solution_provider_id);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mb-4 w-full">
      <div className="flex flex-wrap md:flex-nowrap gap-4 w-full items-start md:items-center">
        <div className="flex items-start gap-2 w-full md:w-[15%]">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 text-primary border-gray-300 rounded"
            onChange={(e) => onSelect(e.target.checked, company.solution_provider_id)}
          />
          <h3
            className="text-sm sm:text-base font-semibold text-primary break-words truncate max-w-[150px] sm:max-w-[200px] cursor-pointer"
            title={company.solution_provider_name}
          >
            {company.solution_provider_name}
          </h3>
        </div>

        <div className="text-xs sm:text-sm text-gray-700 w-full md:w-[50%]">
          {company.relevant_usecase}
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-[20%]">
          {company.key_customers?.map((customer, index) => (
            <Badge key={index} text={customer} />
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-[10%] justify-end md:justify-start">
          <IconButton
            icon={<RiDeleteBin6Line />}
            color="text-[#2286C0]"
            hoverColor="hover:text-red-500"
            onClick={() => setShowDeleteModal(true)}
            disabled={solutionProviders.length < 2 || selectedCompanies >= 1}
          />
          <IconButton
            icon={<FiEdit2 />}
            color="text-[#2286C0]"
            hoverColor="hover:text-green-500"
            onClick={handleEditClick}
            disabled={selectedCompanies >= 1}
          />
          <IconButton
            icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            color="text-[#2286C0]"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${company.solution_provider_name}?`}
        message="This action cannot be undone."
      />

      {editOpen && (
        <EditSolutionProviderForm
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onUpdate={handleUpdate}
          initialData={
            loadingEdit || !details ? null : { ...details, ...company }
          }
          loading={loadingEdit || !details}
        />
      )}

      {isOpen && (
        <div className="mt-4 p-4 border-t">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <ClipLoader color="#3B82F6" size={40} />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            details && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-[70%] w-full space-y-4">
                  <div>
                    <div className="font-bold mb-1">Product/Services Offered</div>
                    <div className="text-sm text-gray-700">{details.offerings}</div>
                  </div>

                  <div>
                    <div className="font-bold mb-1">Partnerships and Alliances</div>
                    <div className="text-sm text-gray-700">
                      {details.partnerships_and_alliances?.join(", ")}
                    </div>
                  </div>

                  <div>
                    <div className="font-bold mb-1">Unique Selling Proposition (USP)</div>
                    <div className="text-sm text-gray-700">{details.usp}</div>
                  </div>

                  <div>
                    <div className="font-bold mb-1">Other Use Cases</div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {formatUseCases(details.other_usecases)}
                    </ul>
                  </div>
                </div>

                <div className="md:w-[30%] w-full flex flex-col gap-2 mt-2">
                  <div className="font-bold mb-1">Contact Details:</div>
                  {details.email && (
                    <ContactBadge
                      icon={<FaEnvelope />}
                      text={details.email}
                      href={`mailto:${details.email}`}
                    />
                  )}
                  {details.phone_number && (
                    <ContactBadge
                      icon={<FaPhone />}
                      text={details.phone_number}
                      href={`tel:${details.phone_number}`}
                    />
                  )}
                  {details.solution_provider_url && (
                    <ContactBadge
                      icon={<FaGlobe />}
                      text="Website"
                      href={details.solution_provider_url}
                    />
                  )}
                  {details.linkedin_url && (
                    <ContactBadge
                      icon={<FaLinkedin />}
                      text="LinkedIn"
                      href={details.linkedin_url}
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;