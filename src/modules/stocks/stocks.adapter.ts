import { Candle, Quote, StockSearchResult } from "./stocks.types";

export function adaptDailyCandle(rawData: any, responseKey: string): Candle[] {
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

export function adaptQuote(rawData: any): Quote {
  if (rawData["Error Message"] || rawData["Note"]) {
    throw new Error("Alpha Vantage error or rate limit exceeded");
  }

  const quote = rawData["Global Quote"];
  if (!quote) {
    throw new Error("Invalid data format from Alpha Vantage");
  }

  return {
    symbol: quote["01. symbol"],
    price: Number(quote["05. price"]),
    changePercent: quote["10. change percent"],
  };
}


export function adaptSearch(rawData: any): StockSearchResult[]{

  if (rawData["Error Message"] || rawData["Note"]) {
    throw new Error("Alpha Vantage error or rate limit exceeded");
  }

  const matchs = rawData["bestMatches"];
  if (!matchs) {
    throw new Error("Invalid data format from Alpha Vantage");
  }


  return matchs.map((item :any) => ({
    symbol: item["1. symbol"],
    name: item["2. name"],
    region: item["4. region"],
    currency: item["8. currency"]
  }))
}