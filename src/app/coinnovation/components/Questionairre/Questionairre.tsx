import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { LuLoaderCircle } from "react-icons/lu";
import QuestionnaireUploadModal from "./QuestionnaireUploadModal";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

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

interface QuestionnaireProps {
  questionnaireData: QuestionnaireData;
  setQuestionnaireData: React.Dispatch<React.SetStateAction<QuestionnaireData>>;
  problemStatement: string;
  projectDescription: string;
  projectID: string | null;
  jsonForDocument: Record<string, any> | null;
  setJsonForDocument: React.Dispatch<
    React.SetStateAction<Record<string, any> | null>
  >;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questionnaireData,
  setQuestionnaireData,
  problemStatement,
  projectID,
  projectDescription,
  jsonForDocument,
  setJsonForDocument,
  setActiveTab,
}) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>(
    {}
  );
  const [editedAnswerValues, setEditedAnswerValues] = useState<Record<string, string>>({});
  const [newQuestionInputs, setNewQuestionInputs] = useState<
    Record<string, boolean>
  >({});
  const [newQuestionText, setNewQuestionText] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isPDDJsonGenerating, setIsPDDJsonGenerating] =
    useState<boolean>(false);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] =
    useState<boolean>(false);
  const [questionnaireFile, setQuestionnaireFile] = useState<File>();

  // Constants
  const API_BASE_URL = "https://tyn-server.azurewebsites.net/";
  const LOCAL_API_BASE_URL = "https://tyn-server.azurewebsites.net/";

  useEffect(() => {
    if (questionnaireFile) {
      processUploadedQuestionnaire(questionnaireFile);
    }
  }, [questionnaireFile]);

  const processUploadedQuestionnaire = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        toast.error("Invalid Excel file: No sheets found");
        return;
      }
      
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!Array.isArray(jsonData) || jsonData.length < 2) {
        toast.error("Invalid Excel file: No data found or incorrect format");
        return;
      }

      const expectedHeaders = [
        "SI No",
        "Questions",
        "Assumed Answers",
        "Actual Answers",
      ];
      const fileHeaders = jsonData[0] || [];

      const isValidTemplate = expectedHeaders.every(
        (header, index) => fileHeaders[index]?.toString().trim() === header
      );

      if (!isValidTemplate) {
        toast.info(
          "Invalid file format. Expected headers: SI No, Questions, Assumed Answers, Actual Answers."
        );
        return;
      }

      const parsedData: QuestionnaireData = { categories: {} };

      let currentCategory: string | null = null;

      jsonData.slice(1).forEach((row: any[]) => {
        if (!Array.isArray(row)) return;
        
        const siNo = row[0] ? row[0].toString().trim() : "";
        const question = row[1] ? row[1].toString().trim() : "";
        const assumedAnswer = row[2] ? row[2].toString().trim() : "";
        const actualAnswer = row[3] ? row[3].toString().trim() : "";

        if (
          siNo !== "" &&
          question === "" &&
          assumedAnswer === "" &&
          actualAnswer === ""
        ) {
          currentCategory = siNo;
          parsedData.categories[currentCategory] = { questions: [] };
        } else if (currentCategory && question !== "") {
          parsedData.categories[currentCategory].questions.push({
            question,
            answer: {
              assumed: assumedAnswer,
              actual: actualAnswer || null,
            },
          });
        }
      });

      if (Object.keys(parsedData.categories).length === 0) {
        toast.warning("No valid categories or questions found in the file");
        return;
      }

      setQuestionnaireData(parsedData);
      toast.success("Questionnaire uploaded successfully");
    } catch (error) {
      console.error("Error processing questionnaire file:", error);
      toast.error(
        "An error occurred while processing the file. Please try again."
      );
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleAnswer = (question: string) => {
    setOpenAnswers((prev) => ({ ...prev, [question]: !prev[question] }));
  };

  const toggleQuestionSelection = (category: string, questionIndex: number) => {
    const questionId = `${category}-${questionIndex}`;

    setSelectedQuestions((prev) => {
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
    setNewQuestionInputs((prev) => ({ ...prev, [category]: true }));
  };

  const handleSaveNewQuestion = (category: string) => {
    if (newQuestionText.trim()) {
      setQuestionnaireData((prevData) => {
        const updated = {
          ...prevData,
          categories: {
            ...prevData.categories,
            [category]: {
              questions: [
                ...prevData.categories[category].questions,
                {
                  question: newQuestionText,
                  answer: {
                    assumed: "Default assumed answer",
                    actual: null,
                  },
                  isSelected: false,
                },
              ],
            },
          },
        };

        saveUpdatedQuestionnaire(updated);

        return updated;
      });
      setNewQuestionText("");
      setNewQuestionInputs((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleDeleteSelected = (category: string) => {
    const hasSelectedInCategory = Array.from(selectedQuestions).some((id) =>
      id.startsWith(`${category}-`)
    );
    
    if (!hasSelectedInCategory) return;

    setQuestionnaireData((prevData) => {
      const updatedCategories = { ...prevData.categories };
      
      // Get the indices to delete and filter out questions
      const indicesToDelete = Array.from(selectedQuestions)
        .filter(id => id.startsWith(`${category}-`))
        .map(id => parseInt(id.split('-')[1]));
      
      const updatedQuestions = updatedCategories[category].questions.filter(
        (_, index) => !indicesToDelete.includes(index)
      );

      if (updatedQuestions.length === 0) {
        delete updatedCategories[category];
      } else {
        updatedCategories[category] = { questions: updatedQuestions };
      }

      const updated = { categories: updatedCategories };

      saveUpdatedQuestionnaire(updated);

      return updated;
    });

    // Clean up selected questions
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      Array.from(prev).forEach((id) => {
        if (id.startsWith(`${category}-`)) {
          newSet.delete(id);
        }
      });
      return newSet;
    });
  };

  const handleEditAnswer = (category: string, questionIndex: number) => {
    const questionId = `${category}-${questionIndex}`;
    const currentAnswer = questionnaireData.categories[category].questions[questionIndex].answer.assumed;
    
    setEditedAnswerValues((prev) => ({
      ...prev,
      [questionId]: currentAnswer
    }));
    
    setEditingAnswers((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleEditAnswerChange = (questionId: string, value: string) => {
    setEditedAnswerValues((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSaveAnswer = (category: string, questionIndex: number) => {
    const questionId = `${category}-${questionIndex}`;
    const newAnswer = editedAnswerValues[questionId] || "";
    
    setQuestionnaireData((prevData) => {
      const updatedCategories = { ...prevData.categories };
      updatedCategories[category].questions[questionIndex].answer.assumed = newAnswer;

      const updated = { categories: updatedCategories };
      saveUpdatedQuestionnaire(updated);
      return updated;
    });
    
    setEditingAnswers((prev) => ({
      ...prev,
      [questionId]: false,
    }));
  };

  const handleGeneratePDD = () => {
    const hasQuestions = Object.values(questionnaireData.categories).some(
      (category) => category.questions.length > 0
    );

    if (!hasQuestions) {
      toast.error(
        "No questions are available. Please upload a questionnaire file or add questions before proceeding."
      );
      return;
    }

    if (!projectID) {
      toast.error("Project ID is required to generate PDD");
      return;
    }

    const data = {
      problem_statement: problemStatement,
      context: projectDescription,
      categories: questionnaireData,
      project_id: projectID,
    };

    setIsPDDJsonGenerating(true);

    const makeRequest = async (baseUrl: string) => {
      try {
        const response = await axios.post(
          `${baseUrl}/coinnovation/generate-challenge-document/`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        setJsonForDocument(response.data.data.json);
        setActiveTab("01.c");
        toast.success("PDD generated successfully!");
        return true;
      } catch (error) {
        console.error(`Error with endpoint ${baseUrl}:`, error);
        return false;
      }
    };

    makeRequest(API_BASE_URL).then(success => {
      if (!success) {
        return makeRequest(LOCAL_API_BASE_URL);
      }
      return true;
    }).finally(() => {
      setIsPDDJsonGenerating(false);
    }).catch(() => {
      toast.error("Failed to generate PDD. Please try again later.");
      setIsPDDJsonGenerating(false);
    });
  };

  const handleDownloadQuestionnaire = async () => {
    if (Object.keys(questionnaireData.categories).length === 0) {
      toast.info("No questions available to download.");
      return;
    }
    
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Questionnaire");
      
      const headerStyle = {
        font: { name: "Raleway", size: 10, bold: true },
        alignment: {
          horizontal: "center" as "center",
          vertical: "middle" as "middle",
        },
        fill: {
          type: "pattern" as "pattern",
          pattern: "solid" as "solid",
          fgColor: { argb: "D9EAD3" },
        },
      };
      
      const normalStyle = {
        font: { name: "Raleway", size: 10 },
        alignment: { vertical: "middle" as "middle" },
      };
      
      worksheet
        .addRow(["SI No", "Questions", "Assumed Answers", "Actual Answers"])
        .eachCell((cell) => {
          cell.style = headerStyle;
        });
        
      let rowIndex = 2;
      
      Object.keys(questionnaireData.categories).forEach((category) => {
        const categoryRow = worksheet.addRow([category, "", "", ""]);
        categoryRow.eachCell((cell) => {
          cell.style = headerStyle;
        });
        worksheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
        rowIndex++;
        
        questionnaireData.categories[category].questions.forEach(
          (questionObj, index) => {
            const question = questionObj.question;
            const assumedAnswer =
              questionObj.answer.assumed || "No Answer Provided";
            const actualAnswer =
              questionObj.answer.actual || "No Answer Provided";
              
            const questionRow = worksheet.addRow([
              index + 1,
              question,
              assumedAnswer,
              actualAnswer,
            ]);
            
            questionRow.eachCell((cell) => {
              cell.style = normalStyle;
            });
            
            rowIndex++;
          }
        );
      });

      worksheet.columns = [
        { width: 10 },
        { width: 80 },
        { width: 60 },
        { width: 60 },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      saveAs(blob, "Briefing_Questionnaire.xlsx");
      toast.success("Questionnaire downloaded successfully");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to download questionnaire");
    }
  };

  const handleQuestionnaireUpload = () => {
    setIsQuestionnaireModalOpen(true);
  };

  const saveUpdatedQuestionnaire = (updatedData: QuestionnaireData) => {
    if (!projectID) {
      toast.error("Cannot save without a project ID");
      return;
    }

    const payload = {
      project_id: projectID,
      categories: updatedData.categories,
    };

    axios.put(
      `${API_BASE_URL}/coinnovation/generate-questions/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(() => toast.success("Questionnaire updated successfully"))
    .catch((error) => {
      console.error("Failed to update questionnaire:", error);
      toast.error("Failed to update questionnaire. Please try again.");
      
      // Try local fallback
      axios.put(
        `${LOCAL_API_BASE_URL}/coinnovation/generate-questions/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => toast.success("Questionnaire updated successfully"))
      .catch((fallbackError) => {
        console.error("Failed to update questionnaire (fallback):", fallbackError);
        toast.error("Failed to update questionnaire. Please try again.");
      });
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-black py-2 rounded-md">
        <h1 className="text-[14px] font-semibold text-[#4A4D4E]">
          Questionnaire
        </h1>
        <button onClick={handleDownloadQuestionnaire}>
          <Image
            alt="Download Questionnaire"
            src="/coinnovation/download_questionairre.svg"
            width={30}
            height={30}
          />
        </button>
      </div>

      <div className="p-3">
        {Object.entries(questionnaireData.categories).map(
          ([category, details], index) => {
            const hasSelected = Array.from(selectedQuestions).some((id) =>
              id.startsWith(`${category}-`)
            );

            return (
              <div key={category} className="mb-4">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                  <h2 className="text-[14px] font-semibold text-[#4A4D4E]">
                    {index + 1}. {category}
                  </h2>
                  <div className="flex flex-row gap-8">
                    <span
                      className="text-[#2286C0] cursor-pointer"
                      onClick={() => handleAddQuestion(category)}
                    >
                      <IoMdAdd />
                    </span>
                    <span
                      className={`${
                        hasSelected
                          ? "text-[#2286C0] cursor-pointer"
                          : "text-[#A1AEBE] cursor-default"
                      }`}
                      onClick={() => {
                        if (hasSelected) handleDeleteSelected(category);
                      }}
                    >
                      <RiDeleteBin6Line />
                    </span>
                    <span
                      className="text-[#2286C0] cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {openCategories[category] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  </div>
                </div>

                {openCategories[category] && (
                  <div className="mt-2">
                    {newQuestionInputs[category] && (
                      <div className="px-4 py-2 bg-white rounded-[8px] mt-2">
                        <input
                          type="text"
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          placeholder="Enter new question"
                          className="w-full p-2 rounded-lg focus:ring-0 focus:border-[#9ED0EE] focus:border-[2px] border-[#9ED0EE] text-[13px] text-[#979797]"
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                          <button
                            onClick={() => handleSaveNewQuestion(category)}
                            className="bg-[#2286C0] text-white px-4 py-2 rounded-lg text-[12px]"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setNewQuestionInputs((prev) => ({
                                ...prev,
                                [category]: false,
                              }));
                              setNewQuestionText("");
                            }}
                            className="bg-[#979797] text-white px-4 py-2 rounded-lg text-[12px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {details.questions.map((q, i) => {
                      const questionId = `${category}-${i}`;
                      return (
                        <div
                          key={i}
                          className="px-4 py-2 bg-white rounded-lg mt-2"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedQuestions.has(questionId)}
                                onChange={() =>
                                  toggleQuestionSelection(category, i)
                                }
                                className="h-[12px] w-[12px] border-[#2286C0] rounded-[3px] focus:ring-0 focus:border-0 focus:outline-none appearance-none checked:border-[#2286C0] checked:bg-[#2286C0] checked:transition-all"
                              />
                              <p className="flex flex-row gap-2 text-[14px] text-[#4A4D4E]">
                                <span className="font-semibold">Q{i + 1}</span>
                                <span>{q.question}</span>
                              </p>
                            </div>
                            <span
                              onClick={() => toggleAnswer(q.question)}
                              className="text-[#2286C0] cursor-pointer"
                            >
                              {openAnswers[q.question] ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </span>
                          </div>

                          {openAnswers[q.question] && (
                            <div className="mt-2 px-2 p-2 rounded-lg flex justify-between items-center gap-4">
                              {editingAnswers[questionId] ? (
                                <input
                                  type="text"
                                  value={editedAnswerValues[questionId] || ""}
                                  onChange={(e) => 
                                    handleEditAnswerChange(questionId, e.target.value)
                                  }
                                  className="w-full p-2 rounded-lg focus:ring-0 focus:border-[#9ED0EE] focus:border-[2px] border-[#9ED0EE] text-[13px] text-[#979797]"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={q.answer.assumed}
                                  readOnly
                                  className="w-full p-2 rounded-lg focus:ring-0 focus:border-[#9ED0EE] focus:border-[2px] border-[#9ED0EE] text-[13px] text-[#979797]"
                                />
                              )}
                              
                              {editingAnswers[questionId] ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleSaveAnswer(category, i)}
                                    className="bg-[#2286C0] text-white px-4 py-2 rounded-lg text-[12px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() =>
                                      setEditingAnswers((prev) => ({
                                        ...prev,
                                        [questionId]: false,
                                      }))
                                    }
                                    className="bg-[#979797] text-white px-4 py-2 rounded-lg text-[12px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <MdOutlineModeEdit
                                  className="text-[#2286C0] cursor-pointer"
                                  size={26}
                                  onClick={() => handleEditAnswer(category, i)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        )}

        {Object.keys(questionnaireData.categories).length === 0 && (
          <div className="text-center py-6 bg-white rounded-lg">
            <p className="text-[#979797]">No questionnaire data available. Please upload a questionnaire or add categories manually.</p>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-8 justify-end">
        <button
          className="flex flex-row gap-2 bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]"
          onClick={handleQuestionnaireUpload}
        >
          <div>
            <img src="/coinnovation/uploadfilewhite.svg" alt="Upload" />
          </div>
          <div>Upload</div>
        </button>
        {isPDDJsonGenerating ? (
          <div className="flex bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px] ">
            <LuLoaderCircle className="animate-spin" size={20} />
          </div>
        ) : (
          <button
            className="flex flex-row gap-2 bg-[#0071C1] text-white px-4 py-2 rounded-[12px] items-center justify-center text-[14px]"
            onClick={handleGeneratePDD}
            disabled={Object.keys(questionnaireData.categories).length === 0}
          >
            <div>
              <img src="/coinnovation/savepdd-icon.svg" alt="Save" />
            </div>
            <div>Save & Continue</div>
          </button>
        )}
      </div>

      {isQuestionnaireModalOpen && (
        <div>
          <QuestionnaireUploadModal
            setIsQuestionnaireModalOpen={setIsQuestionnaireModalOpen}
            isQuestionnaireModalOpen={isQuestionnaireModalOpen}
            questionnaireFile={questionnaireFile}
            setQuestionnaireFile={setQuestionnaireFile}
          />
        </div>
      )}
    </div>
  );
};

export default Questionnaire;