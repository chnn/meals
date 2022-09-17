import { useQuery } from "react-query";
import { VisuallyHidden } from "react-aria";

import { Chart } from "./Chart";
import { AutoSizer } from "./AutoSizer";
import { fetchForecast } from "../util/weather";

export const LoadingWeatherDewPointChart = () => {
  return (
    <div className="w-full h-[400px] bg-slate-50 animate-pulse">
      <VisuallyHidden>Loading...</VisuallyHidden>
    </div>
  );
};

export const WeatherDewPointChart = ({
  coordinates,
}: {
  coordinates: string;
}) => {
  const forecastQuery = useQuery(["forecast", coordinates], () =>
    fetchForecast(coordinates)
  );

  if (!forecastQuery.data) {
    return <LoadingWeatherDewPointChart />;
  }

  const [lat, lon] = coordinates.split(",").map((s) => +s.trim());

  return (
    <div className="w-full overflow-x-scroll overflow-y-hidden">
      <AutoSizer>
        {({ width }) => (
          <Chart
            width={width}
            height={400}
            tss={Object.values(forecastQuery.data.tss)}
            lat={lat}
            lon={lon}
          />
        )}
      </AutoSizer>
    </div>
  );
};
