import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../AddCompanyComponent/Model";
import Input from "./Input";
import Button from "../Button";
import TextArea from "./TextArea";
import { useFieldArray } from "react-hook-form";
import { RiAddCircleLine, RiDeleteBinLine } from "react-icons/ri";


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
    formState: { errors, isDirty },
    reset,
  } = useForm();

  const {
    fields: allianceFields,
    append: appendAlliance,
    remove: removeAlliance,
  } = useFieldArray({
    control,
    name: "partnerships_and_alliances",
  });

  const {
    fields: usecaseFields,
    append: appendUsecase,
    remove: removeUsecase,
  } = useFieldArray({
    control,
    name: "other_usecases",
  });

  const {
    fields: customerFields,
    append: appendCustomer,
    remove: removeCustomer,
  } = useFieldArray({
    control,
    name: "key_customers",
  });

  useEffect(() => {
    if (initialData && !loading) {
      const parsedUsecases = initialData.other_usecases?.map((uc: any) => {
        try {
          return typeof uc === "string"
            ? JSON.parse(uc.replace(/'/g, '"'))
            : uc;
        } catch {
          return { industry: "", impact: "" };
        }
      }) || [];

      reset({
        solution_provider_name: initialData.solution_provider_name || "",
        relevant_usecase: initialData.relevant_usecase || "",
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        solution_provider_url: initialData.solution_provider_url || "",
        linkedin_url: initialData.linkedin_url || "",
        offerings: Array.isArray(initialData.offerings)
          ? initialData.offerings.join("\n")
          : initialData.offerings || "",
        key_customer: initialData.key_customer || "",
        usp: initialData.usp || "",
        key_customers:
          initialData.key_customers?.map((c: string) => ({ name: c })) || [],
        partnerships_and_alliances:
          initialData.partnerships_and_alliances?.map((p: string) => ({
            name: p,
          })) || [],
        other_usecases: parsedUsecases.length
          ? parsedUsecases
          : [{ industry: "", impact: "" }],
      });
    }
  }, [initialData, loading, reset]);

  const onSubmit = (data: any) => {
    const updatedData = {
      ...initialData,
      ...data,
      key_customers: data.key_customers
        .map((c: any) => c.name?.trim())
        .filter(Boolean),
      partnerships_and_alliances: data.partnerships_and_alliances
        .map((p: any) => p.name?.trim())
        .filter(Boolean),
      other_usecases: data.other_usecases
        .map((uc: any) => ({
          industry: uc.industry?.trim(),
          impact: uc.impact?.trim(),
        }))
        .filter((uc: any) => uc.industry && uc.impact),
      offerings: data.offerings
        .split("\n")
        .map((o: string) => o.trim())
        .filter(Boolean),
    };

    console.log(updatedData);
    onUpdate(updatedData);
    onClose();
  };



  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const confirmDiscardChanges = () => {
    setShowConfirmCancel(false);
    onClose();
  };

  const cancelDiscard = () => {
    setShowConfirmCancel(false);
  };

  const handleCancel = () => {
    console.log("Cancel update.........");
    if (isDirty) {
      setShowConfirmCancel(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title="Edit Solution Providers"
        type="edit"
      >
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-600 text-sm">
            Loading provider details...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="h-[80vh] overflow-y-auto">
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
                    name="phone_number"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Phone Number is required",
                      pattern: {
                        value: /^\+?[0-9\s\-()]{7,15}$/,
                        message: "Enter a valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Phone Number"
                        error={errors.phone_number?.message}
                        required={true}
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
                      required={true}
                    />
                  )}
                />
                  <Controller
                    name="usp"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextArea {...field} label="USP" required={true} />
                    )}
                  />
            
              
                  <div className="flex flex-col gap-2">
                    <label className="mb-1 text-sm font-medium text-gray-700">Key Customers</label>
                    {customerFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Controller
                          name={`key_customers[${index}].name`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Input
                              {...field}
                              label={``}
                              placeholder={`Customer ${index + 1}`}
                              className="w-[25vw]"
                            />
                          )}
                        />
                        <button type="button" onClick={() => removeCustomer(index)}>
                          <RiDeleteBinLine className="text-[#0071C1]" size={16} />
                        </button>
                      </div>
                    ))}
                    {customerFields.length < 4 && (
                      <button
                        type="button"
                        onClick={() => appendCustomer({ name: "" })}
                        className="flex items-center text-[#0071C1] gap-1 text-xs mt-2"
                      >
                        <RiAddCircleLine /> Add Customer
                      </button>
                    )}
                  </div>

              </div>

              <div className="flex flex-col gap-4">

                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Email"
                        error={errors.email?.message}
                        required={true}
                      />
                    )}
                  />
                <Controller
                  name="linkedin_url"
                  control={control}
                  defaultValue=""
                  rules={{
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
                      message: "Enter a valid LinkedIn URL",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="LinkedIn"
                      error={errors.linkedin_url?.message}
                      required={true}
                    />
                  )}
                />

                  <Controller
                    name="solution_provider_url"
                    control={control}
                    defaultValue=""
                    rules={{
                      pattern: {
                        value: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/.*)?$/,
                        message: "Enter a valid URL",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Website"
                        error={errors.solution_provider_url?.message}
                        required={true}
                      />
                    )}
                  />
                <Controller
                  name="offerings"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextArea {...field} label="Offerings" required={true} />
                  )}
                />
                  <div className="flex flex-col gap-2">
                    <label className="mb-1 text-sm font-medium text-gray-700">Partnerships and Alliances</label>
                    {allianceFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Controller
                          name={`partnerships_and_alliances[${index}].name`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="flex items-center gap-2 ">
                              <div className="flex-1 ">
                                <Input
                                  {...field}
                                  label={``} 
                                  placeholder={`Partner ${index + 1}`}
                                  className="w-[25vw]"
                                />
                              </div>
                              <button type="button" onClick={() => removeAlliance(index)}>
                                <RiDeleteBinLine className="text-[#0071C1]" size={16} />
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                    {allianceFields.length < 4 && (
                      <button
                        type="button"
                        onClick={() => appendAlliance({ name: "" })}
                        className="flex items-center text-[#0071C1] gap-1 text-xs"
                      >
                        <RiAddCircleLine /> Add Partner
                      </button>
                    )}
                  </div>

               
            
              </div>
                
            </div>
              <div className="flex flex-col gap-2 mt-4">
                <label className="mb-1 text-sm font-medium text-gray-700">Other Usecases</label>
                {usecaseFields.map((field, index) => (
                  <div key={field.id} className="flex flex-row gap-2 items-center">
                    <Controller
                      name={`other_usecases[${index}].industry`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={``}
                          placeholder="Industry"
                          className="w-[20vw]"
                        />
                      )}
                    />
                    <Controller
                      name={`other_usecases[${index}].impact`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={``}
                          placeholder="Usecase"
                          className="w-[50vw]"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeUsecase(index)}
                      className=""
                    >
                      <RiDeleteBinLine className="text-[#0071C1]" size={16} />
                    </button>
                  </div>
                ))}
                {usecaseFields.length < 4 && (
                  <button
                    type="button"
                    onClick={() => appendUsecase({ industry: "", impact: "" })}
                    className="flex items-center text-[#0071C1] gap-1 text-xs mt-2"
                  >
                    <RiAddCircleLine /> Add Usecase
                  </button>
                )}
              </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button label="Cancel" onClick={handleCancel} />
              <Button label="Update" type="submit" />
            </div>
          </form>
        )}
      </Modal>

      {showConfirmCancel && (
        <Modal
          isOpen={true}
          onClose={cancelDiscard}
          title="Discard Changes?"
          type="warning"
        >
          <div className="py-4">
            <p>You've made changes. Are you sure you want to discard them?</p>
            <div className="flex justify-end gap-3 mt-6">
              <Button label="No" onClick={cancelDiscard} />
              <Button label="Yes, Discard" onClick={confirmDiscardChanges} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default EditSolutionProviderForm;