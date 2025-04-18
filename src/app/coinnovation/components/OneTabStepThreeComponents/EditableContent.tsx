import React from "react";

interface EditableContentProps {
  isEditing: boolean;
  editableText: string;
  setEditableText: (text: string) => void;
  displayItems: any[];
}

const EditableContent: React.FC<EditableContentProps> = ({
  isEditing,
  editableText,
  setEditableText,
  displayItems,
}) => {
  const renderItem = (item: any, index: number): JSX.Element => {
    // Handle strings
    if (typeof item === "string" || typeof item === "number") {
      return <li key={index}>{item}</li>;
    }

    // Handle { Title: ..., Description: ... }
    if (item.Title && item.Description) {
      return (
        <li key={index}>
          <span className="font-semibold">{item.Title}:</span>{" "}
          {item.Description}
        </li>
      );
    }

    // Handle { key: value } style (e.g., {"Energy Optimization": "Focus on ..."})
    if (typeof item === "object" && item !== null) {
      const [key, rawValue] = Object.entries(item)[0];
      const value =
        typeof rawValue === "string" || typeof rawValue === "number"
          ? rawValue
          : JSON.stringify(rawValue); // fallback to string format

      return (
        <li key={index}>
          <span className="font-semibold">{key}:</span> {value}
        </li>
      );
    }

    return <li key={index}>{JSON.stringify(item)}</li>;
  };

  return (
    <>
      {isEditing ? (
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="w-full h-[150px] text-[14px] border border-gray-300 rounded px-2 py-1"
        />
      ) : (
        <ul className="list-disc list-inside space-y-2">
          {Array.isArray(displayItems) && displayItems.length > 0 ? (
            displayItems.map((item, index) => renderItem(item, index))
          ) : (
            <li className="text-gray-400 italic">No data available</li>
          )}
        </ul>
      )}
    </>
  );
};

export default EditableContent;
