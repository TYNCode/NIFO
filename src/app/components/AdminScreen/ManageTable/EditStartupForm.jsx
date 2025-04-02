import React, { useState } from "react";

export const EditStartupForm = ({ startup, onSave, onCancel }) => {
  const [editedStartup, setEditedStartup] = useState({ ...startup });

  const handleChange = (e) => {
    setEditedStartup({ ...editedStartup, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedStartup);
      }}
      className="p-3 "
    >
      <input type="hidden" name="startup_id" value={editedStartup.startup_id} />

      {/* Startup Name */}
      <div className="mb-4">
        <label
          htmlFor="startup_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Startup Name:
        </label>
        <input
          type="text"
          id="startup_name"
          name="startup_name"
          value={editedStartup.startup_name}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>

      {/* Website */}
      <div className="mb-4">
        <label
          htmlFor="startup_url"
          className="block text-gray-700 font-bold mb-2"
        >
          Website:
        </label>
        <input
          type="text"
          id="startup_url"
          name="startup_url"
          value={editedStartup.startup_url}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Industry */}
      <div className="mb-4">
        <label
          htmlFor="startup_industry"
          className="block text-gray-700 font-bold mb-2"
        >
          Industry:
        </label>
        <input
          type="text"
          id="startup_industry"
          name="startup_industry"
          value={editedStartup.startup_industry}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Technology */}
      <div className="mb-4">
        <label
          htmlFor="startup_technology"
          className="block text-gray-700 font-bold mb-2"
        >
          Technology:
        </label>
        <input
          type="text"
          id="startup_technology"
          name="startup_technology"
          value={editedStartup.startup_technology}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Company Stage */}
      <div className="mb-4">
        <label
          htmlFor="startup_company_stage"
          className="block text-gray-700 font-bold mb-2"
        >
          Company Stage:
        </label>
        <input
          type="text"
          id="startup_company_stage"
          name="startup_company_stage"
          value={editedStartup.startup_company_stage}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Country */}
      <div className="mb-4">
        <label
          htmlFor="startup_country"
          className="block text-gray-700 font-bold mb-2"
        >
          Country:
        </label>
        <input
          type="text"
          id="startup_country"
          name="startup_country"
          value={editedStartup.startup_country}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Founders Info */}
      <div className="mb-4">
        <label
          htmlFor="startup_founders_info"
          className="block text-gray-700 font-bold mb-2"
        >
          Founder(s):
        </label>
        <input
          type="text"
          id="startup_founders_info"
          name="startup_founders_info"
          value={editedStartup.startup_founders_info}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="startup_emails"
          className="block text-gray-700 font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="startup_emails"
          name="startup_emails"
          value={editedStartup.startup_emails}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Use Cases */}
      <div className="mb-4">
        <label
          htmlFor="startup_usecases"
          className="block text-gray-700 font-bold mb-2"
        >
          Use Cases:
        </label>
        <textarea
          id="startup_usecases"
          name="startup_usecases"
          value={editedStartup.startup_usecases}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Solutions */}
      <div className="mb-4">
        <label
          htmlFor="startup_solutions"
          className="block text-gray-700 font-bold mb-2"
        >
          Solutions:
        </label>
        <textarea
          id="startup_solutions"
          name="startup_solutions"
          value={editedStartup.startup_solutions}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Overview */}
      <div className="mb-4">
        <label
          htmlFor="startup_overview"
          className="block text-gray-700 font-bold mb-2"
        >
          Overview:
        </label>
        <textarea
          id="startup_overview"
          name="startup_overview"
          value={editedStartup.startup_overview}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="startup_description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description:
        </label>
        <textarea
          id="startup_description"
          name="startup_description"
          value={editedStartup.startup_description}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};
