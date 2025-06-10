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
    if (typeof item === "string" || typeof item === "number") {
      return <li key={index} className="break-words">{item}</li>;
    }

    if (item.Title && item.Description) {
      return (
        <li key={index} className="break-words">
          <span className="font-semibold">{item.Title}:</span>{" "}
          {item.Description}
        </li>
      );
    }

    if (typeof item === "object" && item !== null) {
      const [key, rawValue] = Object.entries(item)[0];
      const value =
        typeof rawValue === "string" || typeof rawValue === "number"
          ? rawValue
          : JSON.stringify(rawValue);

      return (
        <li key={index} className="break-words">
          <span className="font-semibold">{key}:</span> {value}
        </li>
      );
    }

    return <li key={index} className="break-words">{JSON.stringify(item)}</li>;
  };

  return (
    <>
      {isEditing ? (
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="w-full h-[120px] sm:h-[150px] text-[14px] border border-gray-300 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-[#2286C0] focus:border-transparent"
        />
      ) : (
        <ul className="list-disc list-inside space-y-2 text-sm">
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