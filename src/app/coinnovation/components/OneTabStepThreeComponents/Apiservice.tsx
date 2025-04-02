import axios from 'axios';

const API_BASE_URL = "https://tyn-server.azurewebsites.net/coinnovation";

export const fetchProjectDetails = async (projectId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/create-project/?project_id=${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    throw error;
  }
};

export const updateDocumentJson = async (projectId: string, jsonData: Record<string, any>) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/generate-challenge-document/`,
      {
        project_id: projectId,
        json: jsonData
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update document:", error);
    throw error;
  }
};

export const generateDocx = async (
  projectId: string, 
  projectName: string,
  owner: string,
  approver: string,
  category: string,
  businessUnit: string,
  location: string,
  department: string,
  jsonData: Record<string, any>
) => {
  const wrappedData = {
    project_id: projectId,
    project_name: projectName || "Untitled Project",
    owner: owner || "N/A",
    approver: approver || "N/A",
    category: category || "N/A",
    business_unit: businessUnit || "N/A",
    location: location || "N/A",
    department: department || "N/A",
    final_document: jsonData
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/generate-docx/`,
      wrappedData,
      {
        headers: { "Content-Type": "application/json" },
        responseType: "blob"
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generating DOCX document:", error);
    throw error;
  }
};