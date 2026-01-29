import { Router } from 'express'
import { getDailyCandlesController } from "./stocks.controller";

const router = Router();

router.get('/candles/daily/:symbol', getDailyCandlesController);

export default router;

