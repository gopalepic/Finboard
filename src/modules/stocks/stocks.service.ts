import axios from 'axios';
import {Candle} from './stocks.types';
import {adaptDailyCandle} from './stocks.adapter';

const BASE_URL = 'https://www.alphavantage.co/query';

export async function getDailyCandles(symbol: string) : Promise<Candle[]> {
    const response = await axios.get(BASE_URL, {
        params: {
            function: 'TIME_SERIES_DAILY',
            symbol: symbol,
            apikey: process.env.ALPHA_VANTAGE_API_KEY
        }
    }); 

    return adaptDailyCandle(response.data);
}