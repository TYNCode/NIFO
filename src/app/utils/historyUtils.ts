import { Session } from "../interfaces";

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isPrevious7Days = (date: Date): boolean => {
  const today = new Date();
  const prior7Days = new Date(today);
  prior7Days.setDate(today.getDate() - 7);

  return date >= prior7Days && date < today;
};

export const isPast30Days = (date: Date): boolean => {
  const today = new Date();
  const prior30Days = new Date(today);
  prior30Days.setDate(today.getDate() - 30);

  return date >= prior30Days && date < today;
};

export const segregateSessions = (history: Session[]) => {
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
