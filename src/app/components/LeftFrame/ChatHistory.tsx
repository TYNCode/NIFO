import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAllSessions,
  fetchConversationsBySessionId,
  deleteSessionById,
} from "../../redux/features/chat/sessionMessageSlice";
import { FiTrash2 } from "react-icons/fi"; 
import { useRouter } from "next/navigation";

interface ChatHistoryProps {
  onSessionSelect?: (id: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSessionSelect }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allSessions, loading } = useAppSelector((state) => state.sessionMessage);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; sessionId: string | null }>({
    show: false,
    sessionId: null
  });

  useEffect(() => {
    dispatch(fetchAllSessions());
  }, [dispatch]);

  const handleSessionClick = (id: string) => {
    dispatch(fetchConversationsBySessionId(id));
    if (onSessionSelect) {
      onSessionSelect(id);
    }
    router.push(`/chat/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ show: true, sessionId: id });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.sessionId) {
      dispatch(deleteSessionById(deleteModal.sessionId)).then(() => {
        dispatch(fetchAllSessions());
        setDeleteModal({ show: false, sessionId: null });
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, sessionId: null });
  };

  return (
    <div className="bg-[#EEF7FF]">
      <div className="mx-2 bg-white rounded-md">
        <div className="text-xs py-3 px-2 text-gray-400 font-semibold">
          Chat History
        </div>
        {loading ? (
          <div className="text-center text-xs text-gray-400 py-2">Loading...</div>
        ) : allSessions.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-2">No sessions yet.</div>
        ) : (
          <div className="max-h-44 overflow-y-auto pr-1">
            {allSessions.map((session:any) => (
              <div
                key={session.session_id}
                className="flex items-center justify-between mx-1 px-3 py-2.5 rounded-sm text-xs hover:bg-gray-200 cursor-pointer"
              >
                <div
                  className="overflow-hidden overflow-ellipsis whitespace-nowrap pr-2 text-[#2F2F2F] w-full"
                  onClick={() => handleSessionClick(session.session_id)}
                >
                  {session?.conversations[0].message}
                </div>
                <button
                  className="text-red-500 hover:text-red-700 shrink-0 pl-2"
                  onClick={() => handleDeleteClick(session.session_id)}
                  title="Delete Session"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Chat Session</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this chat session? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
