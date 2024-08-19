export function getLastDayOfMonth(today: Date) {
  // last day of current month = one day before the first day of next month
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}
