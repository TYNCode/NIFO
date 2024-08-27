import React from "react";

interface ActionButtonsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isEditing, onEdit, onSubmit, onCancel }) => {
  return (
    <>
      {isEditing ? (
        <>
          <button
            className="bg-blue-500 text-white rounded-md p-2 px-4 hover:bg-blue-600 transition mr-4"
            onClick={onSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-700 rounded-md p-2 px-4 hover:bg-gray-400 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="bg-blue-500 text-white rounded-md p-2 px-4 hover:bg-blue-600 transition"
          onClick={onEdit}
        >
          Edit profile
        </button>
      )}
    </>
  );
};

export default ActionButtons;
