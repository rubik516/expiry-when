import { SimpleDate } from "@/types/date";

export const NOW = new Date();
const MONTHS = [
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
const ONE_DAY = 24 * 60 * 60 * 1000; // in milliseconds

/** Format the duration between two dates, returning the result in the format `${years} year(s) ${months} month(s) ${days} day(s)`. If some values equal 0, they should be ignored in the formatted result.
 * For simplicity, in the formatted result, this algorithm first assumes each year has 365 days and then each month has 30 days, disregarding leap years and months with other numbers of days.
 * However, the function still takes into consideration the correct number of days in each calendar month in its calculation.
 *
 * Example 1: formatDuration(new Date(2024, 8, 9), new Date(2024, 8, 10)) --> "1 day"
 *
 * Example 2: formatDuration(new Date(2024, 0, 1), new Date(2024, 1, 2)) --> "1 month 2 days" (despite January containing 31 days, the function will return "1 month 1 day" instead of "1 month" due to the  assumption of a 30-day month)
 *
 * Example 3: formatDuration(new Date(2024, 0, 1), new Date(2025, 2, 1)) --> "1 year 2 months"
 *
 * Example 4: formatDuration(new Date(2024, 5, 1), new Date(2025, 8, 4)) --> "1 year 3 months 5 days"
 *
 * @method formatDuration
 * @param startDate a timestamp string
 * @param endDate a timestamp string
 *
 * @returns The duration between startDate and endDate in the format `${years} year(s) ${months} month(s) ${days} day(s)`, ignoring any values evaluated to 0 and their units.
 */
export function formatDuration(startDate: string, endDate: string) {
  const convertedStart = new Date(Number(startDate));
  const convertedEnd = new Date(Number(endDate));

  // ignore hours, minutes and seconds in Date objects
  const start = new Date(
    convertedStart.getFullYear(),
    convertedStart.getMonth(),
    convertedStart.getDate()
  ).getTime();
  const end = new Date(
    convertedEnd.getFullYear(),
    convertedEnd.getMonth(),
    convertedEnd.getDate()
  ).getTime();

  const daysBetween = (end - start) / ONE_DAY;
  const years = Math.floor(daysBetween / 365);
  const months = Math.floor((daysBetween % 365) / 30);
  const days = Math.floor((daysBetween % 365) % 30);

  const formattedYears = formatPlurality(years, "year");
  const formattedMonths = formatPlurality(months, "month");
  const formattedDays = formatPlurality(days, "day");

  return [formattedYears, formattedMonths, formattedDays]
    .filter((value) => value !== "")
    .join(" ");
}

export function getMonthDDYYYY(timestamp: string) {
  const date = new Date(Number(timestamp));
  const day = padDate(date.getDate());
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function getMonthYYYY(timestamp: string) {
  const date = new Date(Number(timestamp));
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export function getMonthDDYYYYFromSimpleDate(date: SimpleDate) {
  const month = MONTHS[date.month]; // SimpleDate is 0-based month system
  const year = date.year;
  if (!date.day) {
    return `${month} ${year}`;
  }

  const day = padDate(date.day);
  return `${month} ${day}, ${year}`;
}

function formatPlurality(value: number, unit: string): string {
  return value >= 1 ? `${value} ${unit}${value > 1 ? "s" : ""}` : "";
}

const padDate = (date: number) => {
  return date.toString().length == 2 ? date : `0${date}`;
};
