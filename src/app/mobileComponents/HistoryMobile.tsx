import React, { useEffect } from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchChatHistory } from "../redux/features/chatHistorySlice";
import { Session } from "../interfaces"; 

const HistoryMobile: React.FC = () => {
  const dispatch = useAppDispatch();

  const { history, loading, error } = useAppSelector(
    (state) => state.chatHistory
  );

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

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
    const prior7Days = new Date();
    prior7Days.setDate(today.getDate() - 7);
    return date >= prior7Days && date < today;
  };

  const isPast30Days = (date: Date) => {
    const today = new Date();
    const prior30Days = new Date();
    prior30Days.setDate(today.getDate() - 30);
    return date >= prior30Days && date < today;
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
    const firstHumanMessage = session.messages.find(
      (message) => message.role === "human"
    );
    if (!firstHumanMessage) return null;

    return (
      <div
        key={session.session_id}
        className="mr-8 px-3 py-2.5  overflow-hidden whitespace-nowrap text-[14px] flex gap-4 items-center hover:bg-gray-200 font-normal hover:font-medium rounded-sm hover:text-gray-600 cursor-pointer"
        onClick={() => console.log("Query clicked:", firstHumanMessage.content)}
      >
        <div className="text-gray-300">
          <IoChatbubbleOutline size={22} />
        </div>
        <div>{firstHumanMessage.content}</div>
      </div>
    );
  };

  const { todaySessions, previous7DaysSessions, past30DaysSessions } =
    segregateSessions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

export default HistoryMobile;
