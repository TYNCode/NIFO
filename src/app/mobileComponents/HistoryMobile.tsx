import React from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useAppSelector } from "../redux/hooks";
import { segregateSessions } from "../utils/historyUtils";
import { Session } from "../interfaces";

interface HistoryMobileProps {
  onSelectSession: (sessionId: string) => void;
}

const HistoryMobile: React.FC<HistoryMobileProps> = ({ onSelectSession }) => {
  const { history, loading, error } = useAppSelector(
    (state) => state.chatHistory
  );

  const { todaySessions, previous7DaysSessions, past30DaysSessions } =
    segregateSessions(history);

  const renderSession = (session: Session) => {
    const firstHumanMessage = session.messages.find(
      (message) => message.role === "human"
    );
    if (!firstHumanMessage) return null;

    return (
      <div
        key={session.session_id}
        className="mr-8 px-3 py-2.5 overflow-hidden whitespace-nowrap text-[14px] flex gap-4 items-center hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
        onClick={() => onSelectSession(session.session_id)}
      >
        <div className="text-gray-300">
          <IoChatbubbleOutline size={22} />
        </div>
        <div>{firstHumanMessage.content}</div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
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
  );
};

export default HistoryMobile;
