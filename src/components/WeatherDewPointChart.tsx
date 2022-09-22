import { useQuery } from "react-query";

import { Chart } from "./Chart";
import { AutoSizer } from "./AutoSizer";
import { fetchForecast } from "../util/weather";
import { LoadingChart } from "./LoadingChart";
import { extent } from "d3";

const DAYS_IN_FORECAST = 7;

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
    return <LoadingChart text="Loading..." />;
  }

  const [lat, lon] = coordinates.split(",").map((s) => +s.trim());
  const tss = Object.values(forecastQuery.data.tss);
  const oneHourAgo = Date.now() - 1000 * 60 * 60;

  const xDomain: [number, number] = [
    oneHourAgo,
    oneHourAgo + 1000 * 60 * 60 * 24 * DAYS_IN_FORECAST,
  ];

  const yDomain = extent(tss.map((ts) => ts.points).flat(), (d) => d.value) as [
    number,
    number
  ];

  const dayWidthPx = dayOrWeek === "day" ? 750 : 200;

  return (
    <div className="w-full overflow-x-scroll overflow-y-hidden">
      <AutoSizer>
        {({ width }) => (
          <Chart
            tss={tss}
            xDomain={xDomain}
            yDomain={yDomain}
            lat={lat}
            lon={lon}
            width={
              dayWidthPx * DAYS_IN_FORECAST < width
                ? width
                : dayWidthPx * DAYS_IN_FORECAST
            }
            height={400}
            dayOrWeek={dayOrWeek}
          />
        )}
      </AutoSizer>
    </div>
  );
};
