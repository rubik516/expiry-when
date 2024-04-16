import { SimpleDate } from "../types/date";

export function getMonthDDYYYY(timestamp: string) {
  const date = new Date(Number(timestamp));
  const day = padDate(date.getDate());
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function getMonthDDYYYYFromSimpleDate(date: SimpleDate) {
  const month = months[date.month - 1]; // SimpleDate is 1-based month system
  const year = date.year;
  if (!date.day) {
    return `${month}, ${year}`;
  }

  const day = padDate(date.day);
  return `${month} ${day}, ${year}`;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const padDate = (date: number) => {
  return date.toString().length == 2 ? date : `0${date}`;
};
