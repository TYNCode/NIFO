import React from "react";

export default function BulkDeleteButton({
  handleBulkDelete,
  selectedFlatRows,
}) {
  return (
    <div>
      <button
        onClick={handleBulkDelete}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Bulk Delete ({selectedFlatRows.length})
      </button>
    </div>
  );
}
