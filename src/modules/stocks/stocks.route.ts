import { Router } from 'express'
import { getDailyCandlesController , getCandelsController } from "./stocks.controller";

const router = Router();

router.get('/candles/:symbol', getCandelsController);

export default router;

