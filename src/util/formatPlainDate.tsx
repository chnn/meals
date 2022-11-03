import { parseDateTime, getDayOfWeek } from "@internationalized/date";

const LOCALE = "en-US";

const DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const MONTH_LABELS: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

export const formatPlainDate = (
  isoString: string,
  options: { dayOfWeek?: boolean } = {}
): string => {
  const dateTime = parseDateTime(isoString);

  let formatted = "";

  if (options.dayOfWeek) {
    formatted += `${DAY_LABELS[getDayOfWeek(dateTime, LOCALE)]}, `;
  }

  formatted += `${MONTH_LABELS[dateTime.month]} ${dateTime.day}`;

  return formatted;
};
