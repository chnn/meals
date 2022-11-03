import { Fragment, useId } from "react";
import {
  curveMonotoneX,
  extent,
  line,
  scaleLinear,
  range,
  scaleTime,
  scaleSequential,
  interpolateTurbo,
  maxIndex,
  minIndex,
} from "d3";
import type { ScaleLinear, ScaleSequential, ScaleTime } from "d3";
import {
  getDayOfWeek,
  parseAbsolute,
  ZonedDateTime,
} from "@internationalized/date";
import SunCalc from "suncalc";

import type { TimeSeries, Dimensions, Point } from "../util/weather";
import { darkenToMinContrast } from "../util/color";

type Boundaries = Array<[number, number]>;

const TIME_ZONE = "America/New_York";
const LOCALE = "en-US";

const COLOR_SCALE_BY_TS_LABEL: { [tsLabel: string]: ScaleSequential<string> } =
  {
    Temperature: scaleSequential(interpolateTurbo).domain([0, 35]),
    "Dew Point": scaleSequential(interpolateTurbo).domain([0, 21]),
  };

const cToF = (c: number): number => (c * 9) / 5 + 32;

const unixTimeToZonedDateTime = (t: number): ZonedDateTime => {
  return parseAbsolute(new Date(t).toISOString(), TIME_ZONE);
};

const zonedDateTimeToUnixTime = (d: ZonedDateTime): number => {
  return d.toDate().valueOf();
};

const getBoundaries = (
  startTime: number,
  endTime: number,
  period: "hour" | "day"
): Boundaries => {
  const startDateTime = unixTimeToZonedDateTime(startTime);
  const endDateTime = unixTimeToZonedDateTime(endTime);

  const boundaries: Boundaries = [];
  let currentBoundary = startDateTime.set(
    {
      ...(period === "day" ? { hour: 0 } : null),
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    "earlier"
  );

  while (endDateTime.compare(currentBoundary) >= 0) {
    const boundaryStart = zonedDateTimeToUnixTime(currentBoundary);
    currentBoundary = currentBoundary.add(
      period === "day" ? { days: 1 } : { hours: 1 }
    );

    const boundaryEnd = zonedDateTimeToUnixTime(currentBoundary);
    boundaries.push([boundaryStart, boundaryEnd]);
  }

  return boundaries;
};

const getExtremePoints = (
  points: Point[],
  dayBoundaries: Boundaries
): Point[] => {
  return dayBoundaries.flatMap(([t0, t1]) => {
    const pointsInDay = points.filter((p) => p.time >= t0 && p.time < t1);

    const maxPoint = pointsInDay[maxIndex(pointsInDay, (p) => p.value)];
    const minPoint = pointsInDay[minIndex(pointsInDay, (p) => p.value)];

    return [minPoint, maxPoint].filter((p) => p.time !== t0);
  });
};

const formatDayOfWeek = (time: number): string => {
  const DAY_OF_WEEK_LABELS: { [n: number]: string } = {
    0: "Su",
    1: "M",
    2: "Tu",
    3: "W",
    4: "Th",
    5: "F",
    6: "Sa",
  };

  const dateTime = unixTimeToZonedDateTime(time);

  return `${DAY_OF_WEEK_LABELS[getDayOfWeek(dateTime, LOCALE)]} ${
    dateTime.month
  }/${dateTime.day}`;
};

const formatTimeOfDay = (time: number): string => {
  return `${unixTimeToZonedDateTime(time).hour}`;
};

const Label = ({
  time,
  x,
  y,
  children,
}: {
  time: number;
  x: number;
  y: number;
  children: React.ReactNode;
}) => {
  return (
    <text
      key={time}
      className="[text-anchor:middle] font-semibold text-xs fill-stone-500"
      x={x}
      y={y}
    >
      {children}
    </text>
  );
};

const Ticks = ({
  width,
  height,
  xTicks,
  yTicks,
}: {
  width: number;
  height: number;
  xTicks: number[];
  yTicks: number[];
}) => {
  return (
    <>
      {xTicks.map((tick) => (
        <line
          key={tick.valueOf()}
          className="stroke-stone-100 stroke-1"
          x1={tick}
          x2={tick}
          y1={0}
          y2={height}
        />
      ))}
      {yTicks.map((tick) => (
        <line
          key={tick}
          className="stroke-stone-100 stroke-1"
          x1={0}
          x2={width}
          y1={tick}
          y2={tick}
        />
      ))}
    </>
  );
};

const NighttimeShading = ({
  dayBoundaries,
  lat,
  lon,
  height,
  xScale,
}: {
  dayBoundaries: Boundaries;
  lat: number;
  lon: number;
  height: number;
  xScale: ScaleTime<number, number>;
}) => {
  const nighttimes = dayBoundaries.flatMap(([d0, d1]) => {
    const { sunrise, sunset } = SunCalc.getTimes(new Date(d1), lat, lon);

    return [
      [d0, sunrise.getTime()],
      [sunset.getTime(), d1],
    ];
  });

  return (
    <>
      {nighttimes.map(([t0, t1]) => (
        <rect
          key={t0}
          className="fill-stone-500 opacity-5"
          x={xScale(t0)}
          y={0}
          height={height}
          width={Math.abs(xScale(t1) - xScale(t0))}
        />
      ))}
    </>
  );
};

const TsPath = ({
  points,
  xScale,
  yScale,
  colorScale,
}: {
  points: Point[];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  colorScale: ScaleSequential<string>;
}) => {
  const gradientId = useId();

  const pathGenerator = line<Point>()
    .curve(curveMonotoneX)
    .x((d) => xScale(d.time))
    .y((d) => yScale(d.value));

  const [d0, d1] = extent(points, (d) => d.value) as [number, number];

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="1" y2="0">
          {range(d0, d1, (d1 - d0) / 10).map((y, i, ys) => (
            <stop
              key={y}
              stopColor={colorScale(y)}
              offset={`${(i / ys.length) * 100}%`}
            />
          ))}
        </linearGradient>
      </defs>
      <path
        d={pathGenerator(points)!}
        strokeWidth="2"
        stroke={`url(#${gradientId})`}
        fill="none"
      ></path>
    </>
  );
};

const PointLabel = ({
  point,
  x,
  y,
  color,
  width,
  height,
  position,
}: {
  point: Point;
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  position: "below" | "above";
}) => {
  // If a label inside the chart is this close to one of the borders, we hide it
  const MIN_SPACE_FOR_INNER_LABELS = 30; // px
  const LABEL_BOTTOM_SPACE = 10;

  if (
    x < MIN_SPACE_FOR_INNER_LABELS ||
    y < MIN_SPACE_FOR_INNER_LABELS ||
    Math.abs(width - x) < MIN_SPACE_FOR_INNER_LABELS ||
    Math.abs(height - y) < MIN_SPACE_FOR_INNER_LABELS
  ) {
    return null;
  }

  const dx = 0;
  const dy = position === "below" ? LABEL_BOTTOM_SPACE : -LABEL_BOTTOM_SPACE;
  const textAnchor = "middle";
  const dominantBaseline = position === "below" ? "hanging" : "auto";

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r="3"
        fill="white"
        stroke={color}
        strokeWidth="2"
      ></circle>
      <text
        x={x + dx}
        y={y + dy}
        fill={darkenToMinContrast(color, "white", 1.5)}
        dominantBaseline={dominantBaseline}
        textAnchor={textAnchor}
        className="text-sm"
      >
        {Math.round(cToF(point.value))}º
      </text>
    </>
  );
};

export const Chart = ({
  tss,
  height,
  width,
  lat,
  lon,
  xDomain,
  yDomain,
  dayOrWeek,
}: {
  tss: TimeSeries[];
  lat: number;
  lon: number;
  xDomain: [number, number];
  yDomain: [number, number];
  dayOrWeek: "day" | "week";
} & Dimensions) => {
  const outerSpacing = { top: 0, right: 0, bottom: 18, left: 0 };
  const innerSpacing = { top: 30, right: 0, bottom: 30, left: 0 };

  const innerWidth = width - outerSpacing.left - outerSpacing.right;
  const innerHeight = height - outerSpacing.top - outerSpacing.bottom;

  const xScale = scaleTime()
    .domain(xDomain)
    .range([innerSpacing.left, innerWidth - innerSpacing.right]);

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([innerHeight - innerSpacing.bottom, innerSpacing.top]);

  const dayBoundaries = getBoundaries(xDomain[0], xDomain[1], "day");

  const boundaries = getBoundaries(
    xDomain[0],
    xDomain[1],
    dayOrWeek === "day" ? "hour" : "day"
  );

  const pointsByLabel: { [tsLabel: string]: Point[] } = tss.reduce(
    (acc, ts) => {
      return {
        ...acc,
        [ts.label]:
          dayOrWeek === "day"
            ? ts.points
            : getExtremePoints(ts.points, dayBoundaries),
      };
    },
    {}
  );

  return (
    <svg className="text-sm font-bold" width={width} height={height}>
      {boundaries.map(([t0, t1]) => (
        <Label
          key={t0}
          time={t0}
          x={outerSpacing.left + xScale(t0 + (t1 - t0) / 2)}
          y={height - 2}
        >
          {dayOrWeek === "day" ? formatTimeOfDay(t0) : formatDayOfWeek(t0)}
        </Label>
      ))}
      <g transform={`translate(${outerSpacing.left},${outerSpacing.top})`}>
        <rect
          x={1}
          y={1}
          width={innerWidth - 2}
          height={innerHeight - 2}
          className="stroke-stone-100 stroke-1 fill-transparent crisp-edges"
        />
        <Ticks
          width={innerWidth}
          height={innerHeight}
          xTicks={boundaries.map(([d0]) => d0).map((x) => xScale(x))}
          yTicks={yScale.ticks(5).map((y) => yScale(y))}
        />
        <NighttimeShading
          dayBoundaries={dayBoundaries}
          lat={lat}
          lon={lon}
          height={innerHeight}
          xScale={xScale}
        />
        {tss.map((ts) => (
          <Fragment key={ts.label}>
            <TsPath
              points={ts.points}
              xScale={xScale}
              yScale={yScale}
              colorScale={COLOR_SCALE_BY_TS_LABEL[ts.label]}
            />
            <>
              {pointsByLabel[ts.label].map((p) => (
                <PointLabel
                  key={p.i}
                  point={p}
                  x={xScale(p.time)}
                  y={yScale(p.value)}
                  width={width}
                  height={height}
                  color={COLOR_SCALE_BY_TS_LABEL[ts.label](p.value)}
                  position={ts.label === "Dew Point" ? "below" : "above"}
                />
              ))}
            </>
          </Fragment>
        ))}
      </g>
    </svg>
  );
};
