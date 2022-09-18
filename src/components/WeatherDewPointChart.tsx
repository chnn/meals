import { useQuery } from "react-query";
import { VisuallyHidden } from "react-aria";

import { Chart } from "./Chart";
import { AutoSizer } from "./AutoSizer";
import { fetchForecast, TimeSeries } from "../util/weather";

export const LoadingWeatherDewPointChart = () => {
  return (
    <div className="w-full h-[400px] bg-slate-50 animate-pulse">
      <VisuallyHidden>Loading...</VisuallyHidden>
    </div>
  );
};

export const WeatherDewPointChart = ({
  coordinates,
  dayOrWeek,
}: {
  coordinates: string;
  dayOrWeek: "day" | "week";
}) => {
  const forecastQuery = useQuery(["forecast", coordinates], () =>
    fetchForecast(coordinates)
  );

  if (!forecastQuery.data) {
    return <LoadingWeatherDewPointChart />;
  }

  const oneDayFromNow = Date.now() + 1000 * 60 * 60 * 24;
  const oneWeekFromNow = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const onePeriodFromNow = dayOrWeek === "day" ? oneDayFromNow : oneWeekFromNow;

  const filteredTss = Object.values(forecastQuery.data.tss).reduce<
    TimeSeries[]
  >((acc, ts) => {
    return [
      ...acc,
      {
        label: ts.label,
        points: ts.points.filter(({ time }) => time < onePeriodFromNow),
      },
    ];
  }, []);

  const [lat, lon] = coordinates.split(",").map((s) => +s.trim());

  return (
    <div className="w-full overflow-x-scroll overflow-y-hidden">
      <AutoSizer>
        {({ width }) => (
          <Chart
            width={width}
            height={400}
            tss={filteredTss}
            lat={lat}
            lon={lon}
          />
        )}
      </AutoSizer>
    </div>
  );
};
