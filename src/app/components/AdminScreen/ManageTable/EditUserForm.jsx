import React, { useState } from "react";

export const EditUserForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditedUser({ ...editedUser, [e.target.name]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedUser);
      }}
    >
      <input type="hidden" name="id" value={editedUser.id} />
      <div className="mb-4">
        <label
          htmlFor="first_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={editedUser.first_name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>
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
          value={editedUser.startup_name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded bg-gray-100 cursor-not-allowed"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={editedUser.is_active}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-gray-700 font-bold">Active Status</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_primary_user"
            name="is_primary_user"
            checked={editedUser.is_primary_user}
            onChange={handleChange}
            className="rounded border-gray-300"
          />
          <span className="text-gray-700 font-bold">Primary User</span>
        </label>
      </div>
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
