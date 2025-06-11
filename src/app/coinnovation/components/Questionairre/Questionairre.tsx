import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { toast } from "react-toastify";
import {
  updateQuestionnaire,
  generatePDD,
  setJsonForDocument,
  setActiveDefineStepTab,
} from "../../../redux/features/coinnovation/challengeSlice";
import { RootState } from "../../../redux/store";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import QuestionnaireUploadModal from "./QuestionnaireUploadModal";
import QuestionnaireHeader from "./components/QuestionairreHeader";
import EmptyState from "./components/EmptyState";
import CategoryBlock from "./components/CategoryBlock";
import ActionButtons from "./components/ActionButtons";

const Questionnaire: React.FC = () => {
  const dispatch = useAppDispatch();

  const { questionnaireData } = useAppSelector((state) => state.challenge);
  const { projectID, projectDetails } = useAppSelector((state) => state.projects);
  const projectName = projectDetails?.project_name

  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] = useState(false);
  const [questionnaireFile, setQuestionnaireFile] = useState<File>();
  const [isPDDJsonGenerating, setIsPDDJsonGenerating] = useState(false);

  const handleDeleteSelected = (category: string) => {
    if (!questionnaireData || !projectID) return;

    const updatedCategories = JSON.parse(JSON.stringify(questionnaireData.categories));

    const indicesToDelete = Array.from(selectedQuestions)
      .filter((id) => id.startsWith(`${category}-`))
      .map((id) => parseInt(id.split("-")[1]));

    const filteredQuestions = updatedCategories[category].questions.filter(
      (_: any, idx: number) => !indicesToDelete.includes(idx)
    );

    if (filteredQuestions.length === 0) {
      delete updatedCategories[category];
    } else {
      updatedCategories[category].questions = filteredQuestions;
    }

    dispatch(updateQuestionnaire({ projectID, updatedCategories }));

    const updatedSet = new Set(selectedQuestions);
    indicesToDelete.forEach((idx) => updatedSet.delete(`${category}-${idx}`));
    setSelectedQuestions(updatedSet);
  };

  const handleGeneratePDD = async () => {
    if (!questionnaireData || !projectID || !projectDetails) return;

    const hasQuestions = Object.values(questionnaireData.categories).some(
      (category) => category.questions.length > 0
    );

    if (!hasQuestions) {
      toast.error("No questions available to generate PDD");
      return;
    }

    setIsPDDJsonGenerating(true);
    const response = await dispatch(
      generatePDD({
        projectID,
        problemStatement: projectDetails.problem_statement || "",
        context: projectDetails.project_description || "",
        questionnaire: questionnaireData,
      })
    );

    if (generatePDD.fulfilled.match(response)) {
      dispatch(setJsonForDocument(response.payload));
      dispatch(setActiveDefineStepTab("01.c"));
      toast.success("PDD generated successfully!");
    } else {
      toast.error("Failed to generate PDD");
    }
    setIsPDDJsonGenerating(false);
  };

  const handleDownloadQuestionnaire = async () => {
    if (!questionnaireData || Object.keys(questionnaireData.categories).length === 0) {
      toast.info("No questions available to download.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questionnaire");

    worksheet.addRow(["SI No", "Questions", "Assumed Answers", "Actual Answers"]);

    Object.entries(questionnaireData.categories).forEach(([category, { questions }]) => {
      worksheet.addRow([category]);
      questions.forEach((q, i) => {
        worksheet.addRow([i + 1, q.question, q.answer.assumed, q.answer.actual || ""]);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${projectID}_${projectName}_questions.xlsx`);

    toast.success("Downloaded successfully!");
  };

  return (
    <div className="w-full">
      <QuestionnaireHeader onDownload={handleDownloadQuestionnaire} />

      <div className="p-3">
        {questionnaireData &&
          Object.entries(questionnaireData.categories).map(([category, details], index) => (
            <CategoryBlock
              key={category}
              category={category}
              details={details}
              index={index}
              selectedQuestions={selectedQuestions}
              setSelectedQuestions={setSelectedQuestions}
              onDeleteSelected={handleDeleteSelected}
            />
          ))}

        {(!questionnaireData || Object.keys(questionnaireData.categories).length === 0) && (
          <EmptyState />
        )}
      </div>

      <ActionButtons
        setIsQuestionnaireModalOpen={setIsQuestionnaireModalOpen}
        isPDDJsonGenerating={isPDDJsonGenerating}
        onGeneratePDD={handleGeneratePDD}
        disableGenerate={
          !questionnaireData || Object.keys(questionnaireData.categories).length === 0
        }
      />

      {isQuestionnaireModalOpen && (
        <QuestionnaireUploadModal
          setIsQuestionnaireModalOpen={setIsQuestionnaireModalOpen}
          isQuestionnaireModalOpen={isQuestionnaireModalOpen}
          questionnaireFile={questionnaireFile}
          setQuestionnaireFile={setQuestionnaireFile}
        />
      )}
    </div>
  );
};

export default Questionnaire;
