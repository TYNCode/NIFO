import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchAllSessions,
  fetchConversationsBySessionId,
  deleteSessionById,
} from "../../redux/features/chat/sessionMessageSlice";
import { FiTrash2 } from "react-icons/fi"; 
import { useRouter } from "next/navigation";

const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allSessions, loading } = useAppSelector((state) => state.sessionMessage);

  useEffect(() => {
    dispatch(fetchAllSessions());
  }, [dispatch]);

  const handleSessionClick = (id: string) => {
    dispatch(fetchConversationsBySessionId(id));
    router.push(`/chat/${id}`)
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSessionById(id)).then(() => {
      dispatch(fetchAllSessions());
    });
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
          allSessions.map((session:any) => (
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
                onClick={() => handleDelete(session.session_id)}
                title="Delete Session"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
