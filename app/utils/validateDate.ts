import { NOW } from "./formatDate";

/** Check if date is in the future of the current moment.
 *
 * @method isFuture
 * @param date a Date object
 *
 * @returns Whether date is in the future of the current moment.
 */
export function isFuture(date: Date) {
  return date.getTime() > NOW.getTime();
}

/** Check if otherDate is in the future of date.
 *
 * @method isFutureOf
 * @param date a pivot Date object
 * @param otherDate a Date object to evaluate
 *
 * @returns Whether otherDate is in the future of date.
 */
export function isFutureOf(date: Date, otherDate: Date) {
  return otherDate.getTime() > date.getTime();
}

/** Check if date is in the past of the current moment.
 *
 * @method isPast
 * @param date a Date object
 *
 * @returns Whether date is in the past of the current moment.
 */
export function isPast(date: Date) {
  return date.getTime() < NOW.getTime();
}

/** Check if otherDate is in the past of date.
 *
 * @method isPastOf
 * @param date a pivot Date object
 * @param otherDate a Date object to evaluate
 *
 * @returns Whether otherDate is in the past of date.
 */
export function isPastOf(date: Date, otherDate: Date) {
  return otherDate.getTime() < date.getTime();
}
