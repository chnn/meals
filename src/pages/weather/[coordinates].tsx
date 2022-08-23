import type { NextPage } from "next";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { VisuallyHidden } from "react-aria";

import { Chart } from "../../components/Chart";
import { AutoSizer } from "../../components/AutoSizer";
import type { TimeSeries } from "../../util/weather";

type WeatherReport = {
  tss: {
    temperature: TimeSeries;
    dewpoint: TimeSeries;
  };
};

const toPoints = (values: any[]) =>
  values.map(({ validTime, value }, i) => ({
    time: Date.parse(validTime.slice(0, validTime.indexOf("/"))),
    value,
    i,
  }));

const fetchForecast = async (coordinates: string): Promise<WeatherReport> => {
  const coordsResp = await fetch(
    `https://api.weather.gov/points/${coordinates}`
  );
  const coordsRespBody = await coordsResp.json();

  // REVIEW: What's the difference between forecastHourly and forecastGridData?
  const forecastResp = await fetch(coordsRespBody.properties.forecastGridData);
  const forecastRespBody = await forecastResp.json();

  return {
    tss: {
      temperature: {
        label: "Temperature",
        points: toPoints(forecastRespBody.properties.temperature.values),
      },
      dewpoint: {
        label: "Dew Point",
        points: toPoints(forecastRespBody.properties.dewpoint.values),
      },
    },
  };
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="lg:p-5">
      <h2 className="text-xl mb-2 px-5 pt-5 lg:px-0 lg:pt-0">
        Temperature & Dew Point
      </h2>
      {children}
    </div>
  );
};

const LoadingChart = () => {
  return (
    <div className="w-full h-[400px] bg-slate-50 animate-pulse">
      <VisuallyHidden>Loading...</VisuallyHidden>
    </div>
  );
};

const ChartContainer = ({ coordinates }: { coordinates: string }) => {
  const forecastQuery = useQuery(["forecast", coordinates], () =>
    fetchForecast(coordinates)
  );

  if (!forecastQuery.data) {
    return <LoadingChart />;
  }

  return (
    <div className="w-full overflow-x-scroll overflow-y-hidden">
      <AutoSizer>
        {({ width }) => (
          <Chart
            width={width}
            height={400}
            tss={Object.values(forecastQuery.data.tss)}
          />
        )}
      </AutoSizer>
    </div>
  );
};

const LocationPage: NextPage = () => {
  const router = useRouter();
  const coordinates = router.query.coordinates as string;

  // Initial server render due to Automatic Static Optimization.
  //
  // TODO: We want the NWS query to happen on the client because it won't be
  // rate limited as much. It's probably easier to achieve this with
  // `next/dynamic` and `{ssr: false}`
  if (typeof coordinates === "undefined") {
    return (
      <Layout>
        <LoadingChart />
      </Layout>
    );
  }

  if (!/-?\d\d?\d?\.\d\d\d\d,-?\d\d?\d?\.\d\d\d\d/.test(coordinates)) {
    return <Layout>Invalid coordinates</Layout>;
  }

  return (
    <Layout>
      <ChartContainer coordinates={coordinates} />
    </Layout>
  );
};

export default LocationPage;
