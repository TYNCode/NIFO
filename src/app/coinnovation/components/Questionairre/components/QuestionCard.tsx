import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";

interface QuestionCardProps {
  index: number;
  question: string;
  assumedAnswer: string;
  isSelected: boolean;
  isOpen: boolean;
  isEditing: boolean;
  editedValue: string;
  onToggleSelect: () => void;
  onToggleAnswer: () => void;
  onEditClick: () => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  index,
  question,
  assumedAnswer,
  isSelected,
  isOpen,
  isEditing,
  editedValue,
  onToggleSelect,
  onToggleAnswer,
  onEditClick,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  return (
    <div className="px-4 py-2 bg-white rounded-lg mt-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-[12px] w-[12px] border-[#2286C0] rounded-[3px]"
          />
          <p className="flex gap-2 text-xs sm:text-sm text-[#4A4D4E]">
            <span className="font-semibold">Q{index + 1}</span>
            <span>{question}</span>
          </p>
        </div>
        <span onClick={onToggleAnswer} className="text-[#2286C0] cursor-pointer">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>

      {isOpen && (
        <div className="mt-2 flex gap-4 items-center">
          {isEditing ? (
            <input
              type="text"
              value={editedValue}
              onChange={onEditChange}
              className="w-full p-2 border-[2px] border-[#9ED0EE] rounded-lg text-xs sm:text-sm text-[#979797]"
            />
          ) : (
            <input
              type="text"
              value={assumedAnswer}
              readOnly
              className="w-full p-2 border-[2px] border-[#9ED0EE] rounded-lg text-xs sm:text-sm text-[#979797]"
            />
          )}

          {isEditing ? (
            <div className="flex space-x-2">
              <button onClick={onSaveEdit} className="bg-[#2286C0] text-white px-4 py-2 rounded-lg text-xs">
                Save
              </button>
              <button onClick={onCancelEdit} className="bg-[#979797] text-white px-4 py-2 rounded-lg text-xs">
                Cancel
              </button>
            </div>
          ) : (
            <MdOutlineModeEdit className="text-[#2286C0] cursor-pointer" size={24} onClick={onEditClick} />
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
