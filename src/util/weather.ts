import { range } from "d3";

export type Dimensions = { width: number; height: number };

export type Point = { time: number; value: number; i: number };

export type TimeSeries = { label: string; points: Point[] };

export type WeatherReport = {
  tss: {
    temperature: TimeSeries;
    dewpoint: TimeSeries;
  };
};

const DURATION_REGEX = /^PT(?<count>\d\d?\d?)H$/;

const parseDurationHours = (durationString: string): number => {
  const count = DURATION_REGEX.exec(durationString)?.groups?.count;

  if (!count) {
    throw new Error(`failed to parse duration string "${durationString}"`);
  }

  return +count;
};

const noaaTsToPoints = (values: any[]): Point[] => {
  const points = values.flatMap(({ validTime, value }) => {
    const [isoString, durationString] = validTime.split("/");
    const durationHours = parseDurationHours(durationString);

    const firstTime = Date.parse(isoString);

    return range(1).map((n) => {
      return { time: firstTime + n * 1000 * 60 * 60, value, i: -1 };
    });
  });

  points.forEach((p, i) => {
    p.i = i;
  });

  return points;
};

export const fetchForecast = async (
  coordinates: string
): Promise<WeatherReport> => {
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
        points: noaaTsToPoints(forecastRespBody.properties.temperature.values),
      },
      dewpoint: {
        label: "Dew Point",
        points: noaaTsToPoints(forecastRespBody.properties.dewpoint.values),
      },
    },
  };
};
