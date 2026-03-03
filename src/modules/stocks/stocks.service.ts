import axios from "axios";
import { Candle, Quote, StockSearchResult } from "./stocks.types";
import { adaptDailyCandle, adaptQuote, adaptSearch } from "./stocks.adapter";
import { memoryCache } from "../../cache/memory.cache";
const BASE_URL = "https://www.alphavantage.co/query";
const DAILY_TTL = 60 * 1000;
const pendingRequests = new Map<string, Promise<Candle[]>>();

export async function getCandels(
  symbol: string,
  interval: string,
): Promise<Candle[]> {
  const functionMap: Record<string, string> = {
    daily: "TIME_SERIES_DAILY",
    weekly: "TIME_SERIES_WEEKLY",
    monthly: "TIME_SERIES_MONTHLY",
  };

  const responseKeyMap: Record<string, string> = {
    daily: "Time Series (Daily)",
    weekly: "Weekly Time Series",
    monthly: "Monthly Time Series",
  };

  const apiFunction = functionMap[interval];
  const responseKey = responseKeyMap[interval];

  if (!apiFunction) {
    throw new Error(
      `Invalid interval: ${interval}. Valid intervals are daily, weekly, monthly.`,
    );
  }

  const cacheKey = `stocks:${symbol}:${interval}`;

  const cached = memoryCache.get<Candle[]>(cacheKey);

  // checking cache before making API call
  if (cached) {
    console.log(`Cache hit for ${symbol}`);
    console.log(cached);
    return cached;
  }

  // checking if there's already a pending request for the same symbol to avoid duplicate API calls
  if (pendingRequests.has(cacheKey)) {
    console.log(`Waiting for pending request for ${symbol}`);
    return pendingRequests.get(cacheKey)!;
  }

  const apiPromise = axios
    .get(BASE_URL, {
      params: {
        function: apiFunction,
        symbol: symbol,
        apikey: process.env.ALPHA_VANTAGE_API_KEY,
      },
    })
    .then((response) => {
      const normalized = adaptDailyCandle(response.data, responseKey);

      // store in cache before returning
      memoryCache.set(cacheKey, normalized, DAILY_TTL);
      return normalized;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  // store the pending request promise to prevent duplicate API calls for the same symbol
  pendingRequests.set(cacheKey, apiPromise);
  return apiPromise;
}

export async function getQuote(symbol: string): Promise<Quote> {
  const cacheKey = `stocks:${symbol}:quote`;

  const cached = memoryCache.get<Quote>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await axios.get(BASE_URL, {
    params: {
      function: "GLOBAL_QUOTE",
      symbol,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  const normalized = adaptQuote(response.data);

  // shorter TTL for quotes (more dynamic)
  memoryCache.set(cacheKey, normalized, 30 * 1000);

  return normalized;
}

export async function searchStocks(
  keywords: string,
): Promise<StockSearchResult[]> {
  const cacheKey = `stocks:search:${keywords}`;
  const cached = memoryCache.get<StockSearchResult[]>(cacheKey);
  if (cached) return cached;

  const response = await axios.get(BASE_URL, {
    params: {
      function: "SYMBOL_SEARCH",
      keywords,
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  const normalized = adaptSearch(response.data);

  memoryCache.set(cacheKey, normalized, 5 * 60 * 1000); // 5 min TTL

  return normalized;
}
