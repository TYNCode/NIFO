import React, { useState, useEffect } from "react";
import Modal from "../AddCompanyComponent/Model";
import Input from "./Input";
import Button from "../Button";
import TextArea from "./TextArea";

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (formData: any) => void;
  initialData: any;
  loading?: boolean;
}

const EditSolutionProviderForm: React.FC<EditFormProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState({
    solution_provider_name: "",
    relevant_usecase: "",
    key_customers: "",
    email: "",
    phone_number: "",
    solution_provider_url: "",
    linkedin_url: "",
    offerings: "",
    key_customer: "",
    usp: "",
    other_usecases: "",
  });

  // Only set form once when data is loaded
  useEffect(() => {
    if (initialData && !loading) {
      const formattedUsecases =
        initialData.other_usecases?.map((uc: any) => {
          try {
            const obj =
              typeof uc === "string" ? JSON.parse(uc.replace(/'/g, '"')) : uc;
            return `${obj.industry}: ${obj.impact}`;
          } catch {
            return uc;
          }
        }) || [];

      setFormData({
        solution_provider_name: initialData.solution_provider_name || "",
        relevant_usecase: initialData.relevant_usecase || "",
        key_customers: initialData.key_customers?.join(", ") || "",
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        solution_provider_url: initialData.solution_provider_url || "",
        linkedin_url: initialData.linkedin_url || "",
        offerings: initialData.offerings || "",
        key_customer: initialData.key_customer || "",
        usp: initialData.usp || "",
        other_usecases: formattedUsecases.join("\n"),
      });
    }
  }, [initialData, loading]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const updatedData = {
      ...initialData,
      ...formData,
      key_customers: formData.key_customers
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      other_usecases: formData.other_usecases
        .split("\n")
        .map((line) => {
          const [industry, ...impactParts] = line.split(":");
          return {
            industry: industry?.trim() || "",
            impact: impactParts.join(":").trim(),
          };
        })
        .filter((uc) => uc.industry && uc.impact),
    };
    onUpdate(updatedData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Solution Provider"
      type="edit"
    >
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-600 text-sm">
          Loading provider details...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                name="solution_provider_name"
                label="Solution Provider Name"
                value={formData.solution_provider_name}
                onChange={handleChange}
                readOnly={true}
              />
              <Input
                name="relevant_usecase"
                label="Relevant Usecase"
                value={formData.relevant_usecase}
                onChange={handleChange}
              />
              <Input
                name="key_customers"
                label="Key Customers (comma separated)"
                value={formData.key_customers}
                onChange={handleChange}
              />
              <Input
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name="phone_number"
                label="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <Input
                name="solution_provider_url"
                label="Website"
                value={formData.solution_provider_url}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Input
                name="linkedin_url"
                label="LinkedIn"
                value={formData.linkedin_url}
                onChange={handleChange}
              />
              <TextArea
                name="offerings"
                label="Offerings"
                value={formData.offerings}
                onChange={handleChange}
              />
              <Input
                name="key_customer"
                label="Key Customer"
                value={formData.key_customer}
                onChange={handleChange}
              />
              <TextArea
                name="usp"
                label="USP"
                value={formData.usp}
                onChange={handleChange}
              />
              <TextArea
                name="other_usecases"
                label="Other Usecases (format: Industry: Impact)"
                value={formData.other_usecases}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button label="Cancel" onClick={onClose} />
            <Button label="Update" onClick={handleSubmit} />
          </div>
        </>
      )}
    </Modal>
  );
};

export default EditSolutionProviderForm;
