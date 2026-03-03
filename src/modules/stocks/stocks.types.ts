export interface Candle { 
 
    timestamp : string,
    open : number,
    high : number,
    low : number,
    close : number,
    volume : number
}

export interface Quote {
  symbol: string;
  price: number;
  changePercent: string;    
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  region: string;
  currency: string;
}