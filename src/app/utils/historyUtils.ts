import { Session } from "../interfaces";

// Function to check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Function to check if a date is within the previous 7 days
export const isPrevious7Days = (date: Date): boolean => {
  const today = new Date();
  const prior7Days = new Date(today); // Clone the current date to avoid modifying today
  prior7Days.setDate(today.getDate() - 7); // Subtract 7 days from the cloned date

  console.log("isPreviousprior7", prior7Days);
  return date >= prior7Days && date < today; // Ensure the date is between prior 7 days and today
};

// Function to check if a date is within the past 30 days
export const isPast30Days = (date: Date): boolean => {
  const today = new Date();
  const prior30Days = new Date(today); // Clone the current date to avoid modifying today
  prior30Days.setDate(today.getDate() - 30); // Subtract 30 days from the cloned date

  return date >= prior30Days && date < today; // Ensure the date is between prior 30 days and today
};

// Function to segregate sessions based on date ranges
export const segregateSessions = (history: Session[]) => {

  console.log("historyUTILSSS", history);
  const todaySessions: Session[] = [];
  const previous7DaysSessions: Session[] = [];
  const past30DaysSessions: Session[] = [];

  console.log(previous7DaysSessions, "isPrevious7dayssessions");
  history.forEach((session) => {
    console.log("sessionhistoryh", session);
    const sessionDate = new Date(session.created_time); // Convert session created_time to Date object

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
