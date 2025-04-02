import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import QuestionCard from "./QuestionCard";
import NewQuestionInput from "./NewQuestionInput";

interface Answer {
  assumed: string;
  actual: string | null;
}

interface Question {
  question: string;
  answer: Answer;
  isSelected?: boolean;
}

interface Category {
  questions: Question[];
}

interface CategoryBlockProps {
  category: string;
  index: number;
  details: Category;
  selectedQuestions: Set<string>;
  setSelectedQuestions: React.Dispatch<React.SetStateAction<Set<string>>>;
  onDeleteSelected: (category: string) => void;
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({
  category,
  index,
  details,
  selectedQuestions,
  setSelectedQuestions,
  onDeleteSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>({});
  const [editedAnswerValues, setEditedAnswerValues] = useState<Record<string, string>>({});

  const toggleSelect = (questionId: string) => {
    const updated = new Set(selectedQuestions);
    updated.has(questionId) ? updated.delete(questionId) : updated.add(questionId);
    setSelectedQuestions(updated);
  };

  const toggleAnswer = (id: string) =>
    setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleEdit = (id: string, current: string) => {
    setEditingAnswers((prev) => ({ ...prev, [id]: true }));
    setEditedAnswerValues((prev) => ({ ...prev, [id]: current }));
  };

  const handleSaveEdit = (id: string) => {
    // Ideally dispatch updateQuestionnaire here
    setEditingAnswers((prev) => ({ ...prev, [id]: false }));
  };

  const handleCancelEdit = (id: string) => {
    setEditingAnswers((prev) => ({ ...prev, [id]: false }));
    setEditedAnswerValues((prev) => ({ ...prev, [id]: "" }));
  };

  const hasSelected = Array.from(selectedQuestions).some((id) =>
    id.startsWith(`${category}-`)
  );

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
        <h2 className="text-sm font-semibold text-[#4A4D4E]">
          {index + 1}. {category}
        </h2>
        <div className="flex gap-6">
          <IoMdAdd className="text-[#2286C0] cursor-pointer" onClick={() => setIsAddingNew(true)} />
          <RiDeleteBin6Line
            className={`cursor-pointer ${
              hasSelected ? "text-[#2286C0]" : "text-[#A1AEBE]"
            }`}
            onClick={() => hasSelected && onDeleteSelected(category)}
          />
          <span className="text-[#2286C0] cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2">
          {isAddingNew && (
            <NewQuestionInput
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              onSave={() => {
                setNewQuestionText("");
                setIsAddingNew(false);
              }}
              onCancel={() => {
                setNewQuestionText("");
                setIsAddingNew(false);
              }}
            />
          )}

          {details.questions.map((q, i) => {
            const questionId = `${category}-${i}`;
            return (
              <QuestionCard
                key={questionId}
                index={i}
                question={q.question}
                assumedAnswer={q.answer.assumed}
                isSelected={selectedQuestions.has(questionId)}
                isOpen={openAnswers[questionId] || false}
                isEditing={editingAnswers[questionId] || false}
                editedValue={editedAnswerValues[questionId] || ""}
                onToggleSelect={() => toggleSelect(questionId)}
                onToggleAnswer={() => toggleAnswer(questionId)}
                onEditClick={() => toggleEdit(questionId, q.answer.assumed)}
                onEditChange={(e) =>
                  setEditedAnswerValues((prev) => ({ ...prev, [questionId]: e.target.value }))
                }
                onSaveEdit={() => handleSaveEdit(questionId)}
                onCancelEdit={() => handleCancelEdit(questionId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryBlock;
