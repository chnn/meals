import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Heading } from "../../components/Heading";
import { DayOrWeekToggle } from "../../components/DayOrWeekToggle";
import {
  WeatherDewPointChart,
  LoadingWeatherDewPointChart,
} from "../../components/WeatherDewPointChart";

const COORDINATES_REGEX = /-?\d\d?\d?\.\d\d\d\d,-?\d\d?\d?\.\d\d\d\d/;

const LocationPage: NextPage = () => {
  const [dayOrWeek, setDayOrWeek] = useState<"day" | "week">("week");

  const router = useRouter();
  const coordinates = router.query.coordinates as string;

  if (coordinates && !COORDINATES_REGEX.test(coordinates)) {
    window.alert(`invalid coordinates "${coordinates}"`);
  }

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
      {coordinates && COORDINATES_REGEX.test(coordinates) ? (
        <WeatherDewPointChart coordinates={coordinates} dayOrWeek={dayOrWeek} />
      ) : (
        <LoadingWeatherDewPointChart />
      )}
    </div>
  );
};

export default LocationPage;
