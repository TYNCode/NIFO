import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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

      reset({
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
  }, [initialData, loading, reset]);

  const onSubmit = (data: any) => {
    const updatedData = {
      ...initialData,
      ...data,
      key_customers: data.key_customers
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean),
      other_usecases: data.other_usecases
        .split("\n")
        .map((line: string) => {
          const [industry, ...impactParts] = line.split(":");
          return {
            industry: industry?.trim() || "",
            impact: impactParts.join(":").trim(),
          };
        })
        .filter((uc: any) => uc.industry && uc.impact),
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <Controller
                  name="solution_provider_name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Solution Provider Name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Solution Provider Name"
                      readOnly={true}
                      error={errors.solution_provider_name?.message}
                    />
                  )}
                />
                <Controller
                  name="relevant_usecase"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Relevant Usecase is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Relevant Usecase"
                      error={errors.relevant_usecase?.message}
                    />
                  )}
                />
                <Controller
                  name="key_customers"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Key Customers are required",
                    pattern: {
                      value: /^[a-zA-Z0-9, ]*$/,
                      message: "Only alphanumeric and commas allowed",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Key Customers (comma separated)"
                      error={errors.key_customers?.message}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email"
                      error={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="phone_number"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone Number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Phone Number"
                      error={errors.phone_number?.message}
                    />
                  )}
                />
                <Controller
                  name="solution_provider_url"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} label="Website" />
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Controller
                  name="linkedin_url"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} label="LinkedIn" />
                  )}
                />
                <Controller
                  name="offerings"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea {...field} label="Offerings" />
                  )}
                />
                <Controller
                  name="key_customer"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} label="Key Customer" />
                  )}
                />
                <Controller
                  name="usp"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea {...field} label="USP" />
                  )}
                />
                <Controller
                  name="other_usecases"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea {...field} label="Other Usecases" />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button label="Cancel" onClick={onClose} />
              <Button label="Update" type="submit" />
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export default EditSolutionProviderForm;
