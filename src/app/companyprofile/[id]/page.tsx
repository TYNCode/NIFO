"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCompanyById, updateCompanyById } from "../../redux/features/companyprofile/companyProfile";
import { decryptURL } from "../../utils/shareUtils";
import { getUserInfo } from "../../utils/localStorageUtils";
import CompanyProfile from "../../components/CompanyProfile/CompanyProfile";
import CompanyForm from "../../components/CompanyProfile/CompanyForm";
import ActionButtons from "../../components/CompanyProfile/ActionButtons";
import { ClipLoader } from "react-spinners";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";

const CompanyProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { company, loading, error } = useAppSelector(
    (state) => state.companyProfile
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    startup_id: 0,
    startup_url: "",
    startup_name: "",
    startup_analyst_rating: "",
    startup_industry: "",
    startup_technology: "",
    startup_overview: "",
    startup_description: "",
    startup_company_stage: "",
    startup_country: "",
    startup_founders_info: "",
    startup_emails: ""
  });

  const [toastVisible, setToastVisible] = useState(false);

  const params = useParams();
  let encodedOrganizationId = params.id;

  if (Array.isArray(encodedOrganizationId)) {
    encodedOrganizationId = encodedOrganizationId[0];
  }

  if (typeof encodedOrganizationId !== "string") {
    console.error("Invalid ID in URL");
    return <div className="p-4 text-red-500">Error: Invalid ID in URL</div>;
  }

  const decodedOrganizationId: string = decryptURL(encodedOrganizationId);

  useEffect(() => {
    dispatch(fetchCompanyById(decodedOrganizationId));
    console.log(company);
  }, [dispatch, decodedOrganizationId]);

  useEffect(() => {
    if (company) {
      setFormData({
        startup_id: company.startup_id,
        startup_url: company.startup_url,
        startup_name: company.startup_name,
        startup_analyst_rating: company.startup_analyst_rating,
        startup_industry: company.startup_industry,
        startup_technology: company.startup_technology,
        startup_overview: company.startup_overview,
        startup_description: company.startup_description,
        startup_company_stage: company.startup_company_stage,
        startup_country: company.startup_country,
        startup_founders_info: company.startup_founders_info,
        startup_emails: company.startup_emails
      });
    }
  }, [company]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      startup_id: company?.startup_id || 0,
      startup_url: company?.startup_url || "",
      startup_name: company?.startup_name || "",
      startup_analyst_rating: company?.startup_analyst_rating || "",
      startup_industry: company?.startup_industry || "",
      startup_technology: company?.startup_technology || "",
      startup_overview: company?.startup_overview || "",
      startup_description: company?.startup_description || "",
      startup_company_stage: company?.startup_company_stage || "",
      startup_country: company?.startup_country || "",
      startup_founders_info: company?.startup_founders_info || "",
      startup_emails: company?.startup_emails || ""
    });
  };

  const handleSubmit = () => {
    dispatch(updateCompanyById({ id: decodedOrganizationId, data: formData }))
      .then(() => {
        setIsEditing(false);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
      })
      .catch(() => {
      });
  };

  const user = getUserInfo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    
    <div className="container mx-auto p-4 max-w-screen-lg">
      {toastVisible && (
        <Toast className="mx-auto my-0">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">Updated successfully.</div>
          <Toast.Toggle />
        </Toast>
      )}

      <div className="mt-10 flex justify-end">
        {user?.is_primary_user && (
          <ActionButtons
            isEditing={isEditing}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>

      <div className="bg-white p-8 rounded-md">
        {isEditing ? (
          <CompanyForm formData={formData} onInputChange={handleInputChange} />
        ) : (
          <CompanyProfile company={company} />
        )}
      </div>

      
    </div>
  );
};

export default CompanyProfilePage;
