import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import { segregateSessions } from "../../utils/historyUtils";

interface HistoryBarProps {
  onSelectHistory: (sessionId: string) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ onSelectHistory }) => {
  const dispatch = useAppDispatch();
  const { history, loading, error } = useAppSelector((state) => state.chatHistory);

  console.log("history inside history bar", history , loading , error)
  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  const handleSessionClick = (sessionId: string) => {
    console.log("Selected Session ID:", sessionId);
    onSelectHistory(sessionId);
  };

  const { todaySessions, previous7DaysSessions, past30DaysSessions } = segregateSessions(history);

  const renderSession = (session: any) => {
    if (!session?.messages || session.messages.length === 0) return null;
    
    const firstMessage = session.messages[0]?.content || "No Content Available";

    return (
      <div key={session.session_id}>
        <div
          className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
          onClick={() => handleSessionClick(session.session_id)}
        >
          {firstMessage}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Query History
      </div>

      {loading && <p className="px-3 py-2 text-gray-500">Loading history...</p>}
      {error && <p className="px-3 py-2 text-red-500">Error: {error}</p>}

      <div>
        {todaySessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">Today</div>
            {todaySessions.slice().reverse().map(renderSession)}
          </>
        )}

        {previous7DaysSessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">Previous 7 Days</div>
            {previous7DaysSessions.slice().reverse().map(renderSession)}
          </>
        )}

        {past30DaysSessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">Past 30 Days</div>
            {past30DaysSessions.slice().reverse().map(renderSession)}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryBar;
