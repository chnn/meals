const OPTIONS = [
  { label: "Today", value: "day" as const },
  { label: "This Week", value: "week" as const },
];

export const DayOrWeekToggle = ({
  dayOrWeek,
  onChangeDayOrWeek,
  className = "",
}: {
  dayOrWeek: "day" | "week";
  onChangeDayOrWeek: (dayOrWeek: "day" | "week") => void;
  className?: string;
}) => {
  return (
    <div
      className={`p-1 gap-x-1 rounded bg-slate-100 flex justify-between items-center ${className}`}
    >
      {OPTIONS.map(({ label, value }) => {
        return (
          <label
            key={value}
            className={
              dayOrWeek === value
                ? "cursor-pointer p-1 flex-1 flex justify-center items-center rounded text-sm font-bold bg-gradient-to-br from-sky-500 to-sky-600 text-slate-50 "
                : "cursor-pointer p-1 flex-1 flex justify-center items-center rounded text-sm font-bold text-slate-700"
            }
          >
            <input
              type="radio"
              className="appearance-none"
              checked={dayOrWeek === value}
              onChange={() => onChangeDayOrWeek(value)}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
};
