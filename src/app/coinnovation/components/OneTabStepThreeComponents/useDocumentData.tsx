// src/hooks/useDocumentData.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchProjectDetails, generateDocx, updateDocumentJson } from './Apiservice';

export const useDocumentData = (projectId: string, initialJsonData: Record<string, any> | null) => {
  const [jsonForDocument, setJsonForDocument] = useState<Record<string, any> | null>(initialJsonData);
  const [projectDetails, setProjectDetails] = useState<Record<string, any>>({});
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjectDetails(projectId);
        setProjectDetails(data);
      } catch (error) {
        console.error("Failed to fetch updated project data:", error);
        toast.error("Failed to fetch project details");
      }
    };

    fetchData();
  }, [projectId]);

  const saveDocument = async () => {
    if (!jsonForDocument) return;
    
    setIsSaving(true);
    try {
      await updateDocumentJson(projectId, jsonForDocument);
      toast.success("Document updated successfully");
    } catch (error) {
      toast.error("Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateDocx = async () => {
    if (!jsonForDocument) return;
    
    setIsGeneratingDocx(true);
    try {
      const blob = await generateDocx(
        projectDetails?.project_id || "N/A",
        projectDetails?.project_name || "Untitled Project",
        projectDetails?.owner || "N/A",
        projectDetails?.approver || "N/A",
        projectDetails?.category || "N/A",
        projectDetails?.business_unit || "N/A",
        projectDetails?.location || "N/A",
        projectDetails?.department || "N/A",
        jsonForDocument
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "Final_Document.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Document downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate DOCX document");
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  return {
    jsonForDocument,
    setJsonForDocument,
    projectDetails,
    isGeneratingDocx,
    isSaving,
    saveDocument,
    handleGenerateDocx
  };
};