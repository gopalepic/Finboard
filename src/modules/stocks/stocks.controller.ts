import { Request } from "express";
import { Response } from "express";
import { getDailyCandles } from "./stocks.service";

export async function getDailyCandlesController(req: Request, res: Response) {
    try {
        const symbol = req.params.symbol as string;

        if (!symbol) {
            return res.status(400).json({
                status: "error",
                message: "Symbol parameter is required"
            });
        }

        const data = await getDailyCandles(symbol);
        return res.status(200).json({
            status:"success",
            data
        })
    }
    catch (error: any) {
        return res.status(500).json({
            status: "error",
            message:"error EPICC " +error.message
        });
    }
}
