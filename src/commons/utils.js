import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  subMonths,
} from "date-fns";

export const formatDate = (date) => {
  return format(date, "yyyy-MM-dd");
};

export const sortByDate = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
};

const period = {
  THIS_WEEK: "This week",
  THIS_MONTH: "This month",
  LAST_MONTH: "Last month",
  THIS_YEAR: "This year",
};

export const getDateRange = (timeFrame) => {
  let startDate = new Date();
  let endDate = new Date();

  const currentDate = new Date();

  if (timeFrame === period.THIS_WEEK) {
    startDate = startOfWeek(currentDate);
    endDate = endOfWeek(currentDate);
  } else if (timeFrame === period.THIS_MONTH) {
    startDate = startOfMonth(currentDate);
    endDate = endOfMonth(currentDate);
  } else if (timeFrame === period.LAST_MONTH) {
    const lastMonth = subMonths(currentDate, 1);
    startDate = startOfMonth(lastMonth);
    endDate = endOfMonth(lastMonth);
  } else {
    startDate = startOfYear(currentDate);
    endDate = endOfYear(currentDate);
  }

  return { startDate, endDate };
};


