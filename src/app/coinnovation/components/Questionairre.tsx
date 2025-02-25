import React, { useState } from "react";
import Image from "next/image";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";

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

interface QuestionnaireData {
  categories: Record<string, Category>;
}

const Questionairre: React.FC = () => {
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    categories: {
      "Manufacturing Process Optimization": {
        questions: [
          {
            question: "What are the main bottlenecks in the production line?",
            answer: {
              assumed: "Material handling delays and frequent machine breakdowns.",
              actual: null,
            },
            isSelected: false,
          },
          {
            question: "How does the current scheduling impact production efficiency?",
            answer: {
              assumed: "Inefficient scheduling causes idle time and over-utilization of certain machines.",
              actual: null,
            },
            isSelected: false,
          },
        ],
      },
      "Supply Chain Management": {
        questions: [
          {
            question: "What challenges are faced in raw material procurement?",
            answer: {
              assumed: "Supplier delays and fluctuating material costs.",
              actual: null,
            },
            isSelected: false,
          },
          {
            question: "How is inventory managed to reduce waste?",
            answer: {
              assumed: "A combination of manual tracking and ERP-based forecasts.",
              actual: null,
            },
            isSelected: false,
          },
        ],
      },
      "Quality Control": {
        questions: [
          {
            question: "What defect rates are observed in final products?",
            answer: {
              assumed: "Approximately 5% of products show minor defects.",
              actual: null,
            },
            isSelected: false,
          },
          {
            question: "What are the key parameters monitored for quality assurance?",
            answer: {
              assumed: "Dimensional accuracy, surface finish, and mechanical strength.",
              actual: null,
            },
            isSelected: false,
          },
        ],
      },
    },
  });

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>({});
  const [newQuestionInputs, setNewQuestionInputs] = useState<Record<string, boolean>>({});
  const [newQuestionText, setNewQuestionText] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleAnswer = (question: string) => {
    setOpenAnswers(prev => ({ ...prev, [question]: !prev[question] }));
  };

  const toggleQuestionSelection = (category: string, questionIndex: number) => {
    const questionId = `${category}-${questionIndex}`;
    
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAddQuestion = (category: string) => {
    setNewQuestionInputs(prev => ({ ...prev, [category]: true }));
  };

  const handleSaveNewQuestion = (category: string) => {
    if (newQuestionText.trim()) {
      console.log("Adding new question:", {
        category,
        question: newQuestionText,
        assumed: "Default assumed answer",
        actual: null
      });

      setQuestionnaireData(prevData => ({
        categories: {
          ...prevData.categories,
          [category]: {
            questions: [
              ...prevData.categories[category].questions,
              {
                question: newQuestionText,
                answer: {
                  assumed: "Default assumed answer",
                  actual: null
                },
                isSelected: false
              }
            ]
          }
        }
      }));
      setNewQuestionText("");
      setNewQuestionInputs(prev => ({ ...prev, [category]: false }));
    }
  };

  const handleDeleteSelected = (category: string) => {
    const hasSelectedInCategory = Array.from(selectedQuestions).some(id => id.startsWith(`${category}-`));
    if (!hasSelectedInCategory) return;

    console.log("Deleting selected questions from category:", category);

    setQuestionnaireData(prevData => {
      const updatedCategories = { ...prevData.categories };
      const updatedQuestions = updatedCategories[category].questions.filter((_, index) => 
        !selectedQuestions.has(`${category}-${index}`)
      );
      
      if (updatedQuestions.length === 0) {
        delete updatedCategories[category];
      } else {
        updatedCategories[category] = { questions: updatedQuestions };
      }
      
      return { categories: updatedCategories };
    });

    // Clear selections for this category only
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      Array.from(prev).forEach(id => {
        if (id.startsWith(category)) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  };

  const handleEditAnswer = (category: string, questionIndex: number) => {
    setEditingAnswers(prev => ({ ...prev, [`${category}-${questionIndex}`]: true }));
  };

  const handleSaveAnswer = (category: string, questionIndex: number, newAnswer: string) => {
    console.log("Saving answer:", {
      category,
      questionIndex,
      newAnswer
    });

    setQuestionnaireData(prevData => {
      const updatedCategories = { ...prevData.categories };
      updatedCategories[category].questions[questionIndex].answer.assumed = newAnswer;
      return { categories: updatedCategories };
    });
    setEditingAnswers(prev => ({ ...prev, [`${category}-${questionIndex}`]: false }));
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center text-black py-2 rounded-md">
        <h1 className="text-xl font-bold">Questionnaire</h1>
        <button>
          <Image
            alt="Download Questionnaire"
            src="/coinnovation/download_questionairre.svg"
            width={30}
            height={30}
          />
        </button>
      </div>

      <div className="p-3">
        {Object.entries(questionnaireData.categories).map(([category, details], index) => (
          <div key={category} className="mb-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg">
              <h2 className="text-lg font-semibold">
                {index + 1}. {category}
              </h2>
              <div className="flex space-x-4 text-blue-500 cursor-pointer">
                <span onClick={() => handleAddQuestion(category)}>
                  <IoMdAdd />
                </span>
                <span onClick={() => handleDeleteSelected(category)}>
                  <RiDeleteBin6Line />
                </span>
                <span onClick={() => toggleCategory(category)}>
                  {openCategories[category] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
            </div>

            {openCategories[category] && (
              <div className="mt-2">
                {newQuestionInputs[category] && (
                  <div className="px-4 py-2 bg-white rounded-lg mt-2">
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Enter new question"
                      className="w-full p-2 rounded-lg border-blue-400 border"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        onClick={() => handleSaveNewQuestion(category)}
                        className="bg-blue-400 text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setNewQuestionInputs(prev => ({ ...prev, [category]: false }));
                          setNewQuestionText("");
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {details.questions.map((q, i) => (
                  <div key={q.question} className="px-4 py-2 bg-white rounded-lg mt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.has(`${category}-${i}`)}
                          onChange={() => toggleQuestionSelection(category, i)}
                          className="h-4 w-4"
                        />
                        <p className="font-medium">
                          Q{i + 1} {q.question}
                        </p>
                      </div>
                      <span
                        onClick={() => toggleAnswer(q.question)}
                        className="text-blue-500 cursor-pointer"
                      >
                        {openAnswers[q.question] ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>

                    {openAnswers[q.question] && (
                      <div className="mt-2 px-2 p-2 rounded-lg flex justify-between items-center gap-4">
                        <input
                          type="text"
                          defaultValue={q.answer.assumed}
                          readOnly={!editingAnswers[`${category}-${i}`]}
                          className="w-full rounded-lg border-blue-400 border-solid border p-2"
                        />
                        {editingAnswers[`${category}-${i}`] ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => handleSaveAnswer(category, i, (e.target as HTMLButtonElement).previousElementSibling?.querySelector('input')?.value || '')}
                              className="bg-blue-400 text-white px-4 py-2 rounded-lg"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAnswers(prev => ({ ...prev, [`${category}-${i}`]: false }))}
                              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <MdOutlineModeEdit
                            className="text-blue-400 cursor-pointer"
                            size={26}
                            onClick={() => handleEditAnswer(category, i)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questionairre;