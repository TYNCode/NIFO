// SolutionProviderForm.tsx
import { useState } from "react";
import Modal from "./Model";
import Button from "../Button";
import { LiaSave } from "react-icons/lia";

interface SolutionProviderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: any) => void;
}

const SolutionProviderForm: React.FC<SolutionProviderFormProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    contactNo: "",
    email: "",
    url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSolutionProvider = {
      project_id: localStorage.getItem("project_id") || "",
      solution_provider_name: formData.companyName,
      contact_person: formData.contactPerson,
      phone_number: formData.contactNo,
      email: formData.email,
      solution_provider_url: formData.url,
    };
    onAdd(newSolutionProvider);
  };

  return (
    <Modal title="New Solution Provider" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { label: "Company Name", name: "companyName" },
          { label: "Contact Person Name", name: "contactPerson" },
          { label: "Contact No", name: "contactNo" },
          { label: "Email", name: "email" },
          { label: "URL Link", name: "url" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="text-sm font-semibold">{label}</label>
            <input
              type="text"
              name={name}
              placeholder={`Please enter the ${label}`}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="w-full border p-2 rounded-md mt-1"
              required
            />
          </div>
        ))}
        <div className="flex justify-center">
          <Button label="Save" icon={<LiaSave />} />
        </div>
      </form>
    </Modal>
  );
};

export default SolutionProviderForm;
