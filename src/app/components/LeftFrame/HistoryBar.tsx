import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchChatHistory } from "../../redux/features/chatHistorySlice";
import { Session } from "../../interfaces";



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
    console.log(session, "seasonseason");
    // router.push(`/${session}`);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPrevious7Days = (date: Date) => {
    const today = new Date();
    const prior7Days = new Date(today.setDate(today.getDate() - 7));
    return date > prior7Days;
  };

  const isPast30Days = (date: Date) => {
    const today = new Date();
    const prior30Days = new Date(today.setDate(today.getDate() - 30));
    return date > prior30Days;
  };

  const segregateSessions = () => {
    const todaySessions: Session[] = [];
    const previous7DaysSessions: Session[] = [];
    const past30DaysSessions: Session[] = [];

    history.forEach((session) => {
      const sessionDate = new Date(session.created_time);

      if (isToday(sessionDate)) {
        todaySessions.push(session);
      } else if (isPrevious7Days(sessionDate)) {
        previous7DaysSessions.push(session);
      } else if (isPast30Days(sessionDate)) {
        past30DaysSessions.push(session);
      }
    });

    return { todaySessions, previous7DaysSessions, past30DaysSessions };
  };

  const renderSession = (session: Session) => {
    const firstMessage = session.messages[0];
    if (!firstMessage) return null;

    return (
      <div key={session.session_id}>
        <div
          className="mx-1 px-3 py-2.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
          onClick={() => {
            console.log("Session clicked:", session.session_id);
            onSelectHistory(session.session_id);
            handleRenderMainSession(session.session_id);
          }}
        >
          {firstMessage.content}
        </div>
      </div>
    );
  };

  const { todaySessions, previous7DaysSessions, past30DaysSessions } = segregateSessions();

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
