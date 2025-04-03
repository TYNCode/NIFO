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
import Badge from "./Badge";
import { FiEdit2 } from "react-icons/fi";
import IconButton from "./IconButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchSolutionProviderDetails } from "../../../redux/features/source/solutionProviderDetailsSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { updateSolutionProvider } from "../../../redux/features/source/solutionProviderDetailsSlice";
import EditSolutionProviderForm from "./EditCompanyComponent/EditSolutionProviderForm";
import { deleteSolutionProvider } from "../../../redux/features/source/solutionProviderSlice";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface CompanyCardProps {
  company: {
    solution_provider_name: string;
    relevant_usecase: string;
    key_customers: string[];
    solution_provider_id: string;
  };
  onSelect: (selected: boolean) => void;
  project_id: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onSelect,
  project_id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [editOpen, setEditOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = (updatedData: any) => {
    dispatch(
      updateSolutionProvider({
        solution_provider_id: company.solution_provider_id,
        updatedData,
      })
    );
  };

  const {
    data: details,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.solutionProviderDetails[company.solution_provider_id]
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

  const formatUseCases = (usecases: string[]) => {
    return usecases.map((uc, idx) => {
      try {
        const parsed = JSON.parse(uc.replace(/'/g, '"'));
        return (
          <li key={idx} className="mb-1">
            <span className="font-semibold">{parsed.industry}:</span>{" "}
            {parsed.impact}
          </li>
        );
      } catch {
        return <li key={idx}>{uc}</li>;
      }
    });
  };

  const ContactBadge = ({
    icon,
    text,
    href,
  }: {
    icon: React.ReactNode;
    text: string;
    href?: string;
  }) => (
    <a
      href={href || "#"}
      target={href ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1 text-sm  text-[#0071C1] rounded-xl mb-2 bg-[#E3F2FE]  "
    >
      {icon}
      {text}
    </a>
  );

  return (
    <div className="border rounded-lg shadow-sm bg-white p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer gap-2">
        <div className="flex items-center gap-6 w-[15%]">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border-2 border-blue-400"
            onChange={(e) => onSelect(e.target.checked)}
          />
          <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-base font-semibold text-[#0071C1]">
              {company.solution_provider_name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-700 mt-2 w-[50%]">
          {company.relevant_usecase}
        </p>

        <div className="flex flex-wrap gap-2 mt-2 w-[20%]">
          {company.key_customers?.map((customer, index) => (
            <Badge key={index} text={customer} />
          ))}
        </div>

        <div className="flex gap-x-6 w-[10%]">
          <IconButton
            icon={<RiDeleteBin6Line />}
            color="text-[#2286C0]"
            hoverColor="hover:text-red-500"
            onClick={() => setShowDeleteModal(true)}
          />
          <IconButton
            icon={<FiEdit2 />}
            color="text-[#2286C0]"
            hoverColor="hover:text-green-500"
            onClick={() => {
              setEditOpen(true);
              if (!details) {
                setLoadingEdit(true);
                dispatch(
                  fetchSolutionProviderDetails({
                    project_id,
                    solution_provider_id: company.solution_provider_id,
                  })
                ).finally(() => {
                  setLoadingEdit(false);
                });
              }
            }}
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
        onConfirm={() => {
          dispatch(
            deleteSolutionProvider({
              project_id,
              solution_provider_id: company.solution_provider_id,
            })
          );
        }}
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
          {loading && <p>Loading provider details...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {details && (
            <div className="flex gap-6">
              <div className="w-[70%]">
                <div className="mb-4">
                  <div className="font-bold mb-1">Product/Services Offered</div>
                  <div className="text-sm">{details.offerings}</div>
                </div>
                <div className="mb-4">
                  <div className="font-bold mb-1">Key Customer</div>
                  <div className="text-sm">{details.key_customer}</div>
                </div>
                <div className="mb-4">
                  <div className="font-bold mb-1">
                    Unique Selling Proposition (USP)
                  </div>
                  <div className="text-sm">{details.usp}</div>
                </div>

                <div className="mb-2 font-bold">Other Use Cases</div>
                <ul className="list-disc list-inside text-sm">
                  {formatUseCases(details.other_usecases)}
                </ul>
              </div>

              <div className="w-[30%] flex flex-col gap-2 mt-1">
                <div className="font-bold mb-1">Contact Details:</div>
                <ContactBadge
                  icon={<FaEnvelope />}
                  text={details.email}
                  href={`mailto:${details.email}`}
                />
                <ContactBadge
                  icon={<FaPhone />}
                  text={details.phone_number}
                  href={`tel:${details.phone_number}`}
                />
                <ContactBadge
                  icon={<FaGlobe />}
                  text="Website"
                  href={details.solution_provider_url}
                />
                <ContactBadge
                  icon={<FaLinkedin />}
                  text="LinkedIn"
                  href={details.linkedin_url}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
