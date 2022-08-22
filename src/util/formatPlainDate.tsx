import { Temporal } from "temporal-polyfill";

const DAY_LABELS: Record<number, string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
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
  const plainDate = Temporal.PlainDate.from(isoString);

  let formatted = "";

  if (options.dayOfWeek) {
    formatted += `${DAY_LABELS[plainDate.dayOfWeek]}, `;
  }

  formatted += `${MONTH_LABELS[plainDate.month]} ${plainDate.day}`;

  return formatted;
};
