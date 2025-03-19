import React from 'react';

interface EditableContentProps {
  isEditing: boolean;
  editableText: string;
  setEditableText: (text: string) => void;
  displayItems: string[];
}

const EditableContent: React.FC<EditableContentProps> = ({
  isEditing,
  editableText,
  setEditableText,
  displayItems
}) => {
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
          {displayItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default EditableContent;