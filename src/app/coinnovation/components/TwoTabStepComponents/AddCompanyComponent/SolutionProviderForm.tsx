import { Controller, useForm } from "react-hook-form";
import Modal from "./Model";
import Button from "../Button";
import { LiaSave } from "react-icons/lia";
import Input from "../EditCompanyComponent/Input";

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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      companyName: "",
      contactPerson: "",
      contactNo: "",
      email: "",
      url: "",
    },
  });

  const onSubmit = (formData: any) => {
    const newSolutionProvider = {
      project_id: localStorage.getItem("project_id") || "",
      solution_provider_name: formData.companyName,
      contact_person: formData.contactPerson,
      phone_number: formData.contactNo,
      email: formData.email,
      solution_provider_url: formData.url,
    };

    onAdd(newSolutionProvider);
    reset();
  };

  return (
    <Modal
      title="New Solution Provider"
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      type="add"
    >
      <div className="w-full max-w-full sm:max-w-md mx-auto p-4 sm:p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="companyName"
            control={control}
            rules={{ required: "Company name is required." }}
            render={({ field }) => (
              <Input
                {...field}
                label="Company Name"
                placeholder="Enter company name"
                error={errors.companyName}
                required
              />
            )}
          />
          <Controller
            name="contactPerson"
            control={control}
            rules={{ required: "Contact person name is required." }}
            render={({ field }) => (
              <Input
                {...field}
                label="Contact Person Name"
                placeholder="Enter contact person name"
                error={errors.contactPerson}
                required
              />
            )}
          />
          <Controller
            name="contactNo"
            control={control}
            rules={{
              required: "Contact number is required.",
              pattern: {
                value: /^\d{10}$/,
                message: "Enter a valid 10-digit phone number.",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Contact No"
                type="tel"
                placeholder="Enter 10-digit phone number"
                error={errors.contactNo}
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address.",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                type="email"
                placeholder="Enter email address"
                error={errors.email}
                required
              />
            )}
          />
          <Controller
            name="url"
            control={control}
            rules={{
              required: "URL is required.",
              pattern: {
                value: /^https?:\/\/\S+\.\S+/,
                message: "Invalid URL (must start with http/https).",
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label="URL Link"
                type="url"
                placeholder="https://example.com"
                error={errors.url}
                required
              />
            )}
          />

          <div className="mt-2 sm:mt-4">
            <Button
              type="submit"
              label="Save"
              icon={<LiaSave />}
              fullWidth
              size="md"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SolutionProviderForm;
