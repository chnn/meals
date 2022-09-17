export type Dimensions = { width: number; height: number };

export type Point = { time: number; value: number; i: number };

export type TimeSeries = { label: string; points: Point[] };

export type WeatherReport = {
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
        points: toPoints(forecastRespBody.properties.temperature.values),
      },
      dewpoint: {
        label: "Dew Point",
        points: toPoints(forecastRespBody.properties.dewpoint.values),
      },
    },
  };
};
