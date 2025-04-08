import React from 'react';

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
  displayItems
}) => {

  console.log('EditableContent', { isEditing, editableText, displayItems });
  const renderItem = (item: any, index: number) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return <li key={index}>{item}</li>;
    }

    if (typeof item === 'object' && item !== null) {
      const title = item.Title || '';
      const description = item.Description || '';
      return (
        <li key={index}>
          <span className="font-semibold">{title}</span>: {description}
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
            displayItems.map(renderItem)
          ) : (
            <li className="text-gray-400 italic">No data available</li>
          )}
        </ul>
      )}
    </>
  );
};

export default EditableContent;
