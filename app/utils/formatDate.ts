import { IntlShape } from "react-intl";

import { SimpleDate } from "@/types/date";
import getDefaultMessage from "@/utils/getDefaultMessage";

export const NOW = new Date();
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
export function formatDuration(
  startDate: string,
  endDate: string,
  intl: IntlShape
) {
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
  if (daysBetween === 0) {
    return intl.formatMessage({
      id: "products.item.used_duration.zero_days",
      defaultMessage: getDefaultMessage(
        "products.item.used_duration.zero_days"
      ),
    });
  }

  const years = Math.floor(daysBetween / 365);
  const months = Math.floor((daysBetween % 365) / 30);
  const days = Math.floor((daysBetween % 365) % 30);

  return intl.formatMessage(
    {
      id: "products.item.used_duration.formatted_duration",
      defaultMessage: getDefaultMessage(
        "products.item.used_duration.formatted_duration"
      ),
    },
    {
      years,
      months,
      days,
    }
  );
}

export function getMonthDDYYYY(timestamp: number | string, intl: IntlShape) {
  return intl.formatDate(timestamp, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export function getMonthYYYY(timestamp: number | string, intl: IntlShape) {
  return intl.formatDate(timestamp, {
    year: "numeric",
    month: "long",
    day: undefined,
  });
}

export function getMonthDDYYYYFromSimpleDate(
  date: SimpleDate,
  intl: IntlShape
) {
  if (!date.day) {
    // SimpleDate is 0-based month system
    return intl.formatDate(new Date(date.year, date.month), {
      year: "numeric",
      month: "long",
      day: undefined,
    });
  }

  return intl.formatDate(new Date(date.year, date.month, date.day), {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}
