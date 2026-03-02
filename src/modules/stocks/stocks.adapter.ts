import { Candle } from "./stocks.types";

export function adaptDailyCandle(rawData: any, responseKey: string): Candle[] {
  const responseKeyMap = {
    daily: "Time Series (Daily)",
    weekly: "Weekly Time Series",
    monthly: "Monthly Time Series",
  };
  if (rawData["Error Message"] || rawData["Error"]) {
    throw new Error("Alpha Vantage error or rate limit exceeded");
  }

  // console.log("Raw data from Alpha Vantage:", rawData);
  const timeSeries = rawData[responseKey];
  if (!timeSeries) {
    throw new Error("Invalid data format from Alpha Vantage");
  }

  const candles: Candle[] = Object.entries(timeSeries).map(
    ([date, values]: [string, any]) => ({
      timestamp: date,
      open: Number(values["1. open"]),
      high: Number(values["2. high"]),
      low: Number(values["3. low"]),
      close: Number(values["4. close"]),
      volume: Number(values["5. volume"]),
    }),
  );

  candles.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return candles;
}
