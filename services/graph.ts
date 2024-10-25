import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";

import { GraphPoint } from "@/types";
dayjs.extend(minMax);

export function adjustCompareData(...data: GraphPoint[][]) {
  const allDates = data
    .map((d) => d.map((point) => dayjs(point.created_at)))
    .flat();
  const minDate = dayjs.min(allDates);
  const maxDate = dayjs.max(allDates);

  const generateDateRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    const dates = [];
    let current = start;

    while (current.isBefore(end)) {
      dates.push(current);
      current = current.add(1, "day");
    }
    dates.push(end);

    return dates;
  };

  const createUniformSet = (
    uniformDates: dayjs.Dayjs[],
    data: GraphPoint[],
  ) => {
    return uniformDates.map((date) => {
      const dataPoint = data.find((point) =>
        dayjs(point.created_at).isSame(date, "day"),
      );

      return dataPoint?.vote || 0;
    });
  };

  const randomRgba = (percent?: number) => {
    const randomNumber = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);
    const randomByte = () => randomNumber(0, 255);
    const randomPercent = () => percent || (randomNumber(50, 100) * 0.01).toFixed(2);

    return `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(",")})`;
  };

  if (minDate && maxDate) {
    const uniformDates = generateDateRange(minDate, maxDate);

    return {
      labels: uniformDates.map((date) => date.format("YYYY-MM-DD")),
      datasets: data.map((d) => {
        return {
          data: createUniformSet(uniformDates, d),
          borderColor: randomRgba(1),
          backgroundColor: randomRgba(0.3),
        };
      }),
    };
  }
}
