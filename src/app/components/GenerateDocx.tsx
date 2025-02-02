"use client";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import jsonData from "../data/ccd.json"; // Import JSON directly

const GenerateDocx = () => {
    const data = jsonData.final_document; 
    const generateBulletPoints = (dataArray: any) => {
        return dataArray.map((item: any) => {
            const key = Object.keys(item)[0]; // Get the first key (e.g., "Area 1")
            const value = item[key]; // Get the corresponding value (e.g., "Install sensors to monitor the temperature.")
            return `${key}: ${value}`;
        }).join("\n• ");
    };

    const loadTemplateAndGenerateDocx = async () => {
        try {
            // Load DOCX Template from /public/
            const response = await fetch("/Template_CCD.docx");
            if (!response.ok) throw new Error("Failed to load template");

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = function (event) {
                if (!event.target) return;
                const content = event.target.result as ArrayBuffer;

                // Read the DOCX file as a ZIP archive
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

                // Manually set each field from JSON to the template

                // Set Challenge Summary (simple text)
                doc.setData({ "Challenge Summary": data["Challenge Summary"] || "No Summary Available" });

                // Set Focus Areas (as bullet points)
                if (data["Focus Areas"]) {
                    const focusAreasBulletPoints = generateBulletPoints(data["Focus Areas"]);
                    doc.setData({ "Focus Areas": focusAreasBulletPoints });
                }

                // Set Technical Requirements (as bullet points)
                if (data["Technical Requirements"]) {
                    const technicalRequirementsBulletPoints = generateBulletPoints(data["Technical Requirements"]);
                    doc.setData({ "Technical Requirements": technicalRequirementsBulletPoints });
                }

                // Set other fields if needed
                doc.setData({ "Overview": data["Overview"] || "No Overview Provided" });
                doc.setData({ "Expected Benefits": data["Expected Benefits"] || "No Benefits Provided" });
                // Add more fields as necessary

                // Generate the Updated DOCX File
                const updatedDocx = doc.getZip().generate({ type: "blob" });
                saveAs(updatedDocx, "Updated_CCD.docx"); // Download the updated DOCX
            };

            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error("Error generating DOCX:", error);
        }
    };

    return (
        <div>
            <h2>Generate DOCX from Template</h2>
            <button onClick={loadTemplateAndGenerateDocx}>Download Updated DOCX</button>
        </div>
    );
};

export default GenerateDocx;
