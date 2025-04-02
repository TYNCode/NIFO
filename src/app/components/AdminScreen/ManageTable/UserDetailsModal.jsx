export const UserDetailsModal = ({ user, isEditing, onClose, children }) => (
  <div className="w-[30%] bg-white border border-gray-300 p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {isEditing ? `Edit User` : `User Details`}
      </h3>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    {children}
  </div>
);
