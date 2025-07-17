import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-between items-center px-6 py-4 border-t text-sm text-gray-600">
    <span>
      Showing <span className="font-semibold">{(page - 1) * 8 + 1}</span> to{" "}
      <span className="font-semibold">{Math.min(page * 8, totalPages * 8)}</span> of{" "}
      <span className="font-semibold">{totalPages * 8}</span> results
    </span>
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span className="font-medium text-gray-700">Page {page} of {totalPages}</span>
      <button
        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  </div>
);

export default Pagination;
