import { Request } from "express";
import { Response } from "express";
import { getCandels, getQuote , searchStocks} from "./stocks.service";

export async function getCandelsController(req: Request, res: Response) {
    try{
        const symbol = req.params.symbol as string;
        const interval = req.query.interval as string ;

        if (!symbol) {
            return res.status(400).json({
                status: "error",
                message: "Symbol parameter is required"
            });
        }

        const data = await getCandels(symbol, interval);
        return res.status(200).json({
            status:"success",
            data
        })
    }catch (error: any) {
        return res.status(500).json({
            status: "error",
            message:"Error fetching candles: " + error.message
        });
    }
}

export async function getQuoteController(req: Request, res: Response) {
  try {
    const symbol = req.params.symbol as string;

    if (!symbol) {
      return res.status(400).json({
        status: "error",
        message: "symbol is required",
      });
    }

    const data = await getQuote(symbol);

    return res.json({
      status: "success",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Quote data unavailable",
    });
  }
}

export async function searchStocksController(req: Request, res: Response) {
  try{

    const q = req.query.q as string;

    if(!q){
      return res.status(400).json({
        status: "error",
        message: "Query parameter 'q' is required"
      });
    }

    const data = await searchStocks(q);

    return res.status(200).json({
      status: "success",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Error searching stocks: " + error.message
    });
  }
}