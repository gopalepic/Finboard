import { Router } from 'express'
import {getCandelsController , getQuoteController , searchStocksController} from "./stocks.controller";

const router = Router();

router.get('/candles/:symbol', getCandelsController);
router.get("/quote/:symbol", getQuoteController);
router.get("/search", searchStocksController);

export default router;

