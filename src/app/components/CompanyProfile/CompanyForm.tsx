import React from "react";

interface CompanyFormProps {
  formData: {
    startup_name: string;
    startup_analyst_rating: string;
    startup_industry: string;
    startup_technology: string;
    startup_overview: string;
    startup_description: string;
    startup_company_stage: string;
    startup_country: string;
    startup_founders_info: string;
    startup_emails: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const capitalizeFirstLetter = (text: string) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CompanyForm: React.FC<CompanyFormProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      {Object.keys(formData).map(key => (
        key !== "startup_id" && (
          <div key={key} className="flex flex-col space-y-2">
            <label className="text-gray-700 font-semibold" htmlFor={key}>
            {capitalizeFirstLetter(key.replace('startup_', '').replace('_', ' '))}:
            </label>
            {key.includes('overview') || key.includes('description') ? (
              <textarea
                id={key}
                name={key}
                value={formData[key]}
                onChange={onInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder={key.replace('startup_', '').replace('_', ' ')}
                rows={4}
              />
            ) : (
              <input
                id={key}
                type="text"
                name={key}
                value={formData[key]}
                onChange={onInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder={key.replace('startup_', '').replace('_', ' ')}
              />
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default CompanyForm;
