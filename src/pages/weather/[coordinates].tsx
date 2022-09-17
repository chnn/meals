import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Heading } from "../../components/Heading";
import {
  WeatherDewPointChart,
  LoadingWeatherDewPointChart,
} from "../../components/WeatherDewPointChart";

const WeatherDewPointChartWrapper = ({
  coordinates,
}: {
  coordinates?: string;
}) => {
  // We want the NWS query to happen on the client because it won't be rate
  // limited as much.
  if (!coordinates) {
    return <LoadingWeatherDewPointChart />;
  }

  if (!/-?\d\d?\d?\.\d\d\d\d,-?\d\d?\d?\.\d\d\d\d/.test(coordinates)) {
    throw new Error(`invalid coordinates "${coordinates}"`);
  }

  return <WeatherDewPointChart coordinates={coordinates} />;
};

const LocationPage: NextPage = () => {
  const router = useRouter();
  const coordinates = router.query.coordinates as string;

  return (
    <div className="py-5 lg:px-5">
      <Heading level={2} className="px-5 lg:px-0">
        Temperature & Dew Point
      </Heading>
      <WeatherDewPointChartWrapper coordinates={coordinates} />
    </div>
  );
};

export default LocationPage;
