import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Heading } from "../../components/Heading";
import { DayOrWeekToggle } from "../../components/DayOrWeekToggle";
import {
  WeatherDewPointChart,
  LoadingWeatherDewPointChart,
} from "../../components/WeatherDewPointChart";

const WeatherDewPointChartWrapper = ({
  coordinates,
  dayOrWeek,
}: {
  coordinates?: string;
  dayOrWeek: "day" | "week";
}) => {
  // We want the NWS query to happen on the client because it won't be rate
  // limited as much.
  if (!coordinates) {
    return <LoadingWeatherDewPointChart />;
  }

  if (!/-?\d\d?\d?\.\d\d\d\d,-?\d\d?\d?\.\d\d\d\d/.test(coordinates)) {
    throw new Error(`invalid coordinates "${coordinates}"`);
  }

  return (
    <WeatherDewPointChart coordinates={coordinates} dayOrWeek={dayOrWeek} />
  );
};

const LocationPage: NextPage = () => {
  const router = useRouter();
  const coordinates = router.query.coordinates as string;

  const [dayOrWeek, setDayOrWeek] = useState<"day" | "week">("week");

  return (
    <div className="py-5 lg:px-5">
      <div className="flex justify-center mb-6 px-5">
        <DayOrWeekToggle
          dayOrWeek={dayOrWeek}
          onChangeDayOrWeek={setDayOrWeek}
          className="w-full sm:w-96"
        />
      </div>
      <Heading level={2} className="px-5 lg:px-0">
        Temperature & Dew Point
      </Heading>
      <WeatherDewPointChartWrapper
        coordinates={coordinates}
        dayOrWeek={dayOrWeek}
      />
    </div>
  );
};

export default LocationPage;
