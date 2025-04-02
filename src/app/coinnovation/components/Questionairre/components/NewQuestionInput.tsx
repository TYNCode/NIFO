import React from "react";

interface NewQuestionInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const NewQuestionInput: React.FC<NewQuestionInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="px-4 py-2 bg-white rounded-[8px] mt-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter new question"
        className="w-full p-2 rounded-lg focus:ring-0 focus:border-[#9ED0EE] focus:border-[2px] border-[#9ED0EE] text-[13px] text-[#979797]"
      />
      <div className="flex justify-end mt-2 space-x-2">
        <button
          onClick={onSave}
          className="bg-[#2286C0] text-white px-4 py-2 rounded-lg text-[12px]"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-[#979797] text-white px-4 py-2 rounded-lg text-[12px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewQuestionInput;
