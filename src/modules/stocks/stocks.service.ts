import axios from 'axios';
import {Candle} from './stocks.types';
import {adaptDailyCandle} from './stocks.adapter';
import { memoryCache } from '../../cache/memory.cache';
const BASE_URL = 'https://www.alphavantage.co/query';
const DAILY_TTL = 60 * 1000

const pendingRequests = new Map<string, Promise<Candle[]>>();
export async function getDailyCandles(symbol: string) : Promise<Candle[]> {

    const cacheKey = `stocks:${symbol}:daily`;

    const cached = memoryCache.get<Candle[]>(cacheKey);

    // checking cache before making API call
    if (cached) {
        console.log(`Cache hit for ${symbol}`);
        return cached;
    }

    // checking if there's already a pending request for the same symbol to avoid duplicate API calls
    if(pendingRequests.has(cacheKey)){
        console.log(`Waiting for pending request for ${symbol}`);
        return pendingRequests.get(cacheKey)!;
    }

    const apiPromise = axios.get(BASE_URL, {
        params: {
            function: 'TIME_SERIES_DAILY',
            symbol: symbol,
            apikey: process.env.ALPHA_VANTAGE_API_KEY
        },
    }).then((response) => {

        const normalized = adaptDailyCandle(response.data);

        // store in cache before returning
        memoryCache.set(cacheKey, normalized, DAILY_TTL);
        return normalized;
    })
    .finally(() =>{
        pendingRequests.delete(cacheKey);
    })

    // store the pending request promise to prevent duplicate API calls for the same symbol
    pendingRequests.set(cacheKey, apiPromise);
    return apiPromise;
}