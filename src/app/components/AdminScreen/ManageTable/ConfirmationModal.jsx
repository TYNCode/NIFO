export const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  confirmText = "Yes",
  cancelText = "No",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-1/3">
        <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
        <p className="mb-4">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
