import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import { segregateSessions } from "../../utils/historyUtils"; // Import the utility function

interface HistoryBarProps {
  onSelectHistory: (sessionId: string) => void;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ onSelectHistory }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.chatHistory);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  console.log("History Data in history bar", history);

  const handleRenderMainSession = (session: string) => {
    console.log("Selected Session ID in HistoryBar:", session); // Log the session ID
    // router.push(`/${session}`); // Commented out until necessary
  };

  const { todaySessions, previous7DaysSessions, past30DaysSessions } =
    segregateSessions(history); // Use the utility function

  const renderSession = (session) => {
    const firstMessage = session.messages[0];
    if (!firstMessage) return null;

    return (
      <div key={session.session_id}>
        <div
          className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
          onClick={() => {
            onSelectHistory(session.session_id); // Trigger session ID update
            handleRenderMainSession(session.session_id); // Log and handle session
          }}
        >
          {firstMessage.content}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="text-sm py-3 px-2 text-gray-400 font-semibold">
        Query History
      </div>
      <div>
        {todaySessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">
              Today
            </div>
            {todaySessions.map(renderSession)}
          </>
        )}
        {previous7DaysSessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">
              Previous 7 Days
            </div>
            {previous7DaysSessions.map(renderSession)}
          </>
        )}
        {past30DaysSessions.length > 0 && (
          <>
            <div className="text-sm py-2 px-2 text-gray-500 font-semibold">
              Past 30 Days
            </div>
            {past30DaysSessions.map(renderSession)}
          </>
        )}
      </div>
    </>
  );
};

export default HistoryBar;
