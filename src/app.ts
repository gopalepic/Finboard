import express from "express";
import stocksRoutes from "./modules/stocks/stocks.route";

const app = express();
app.use(express.json());
app.use('/api/stocks', stocksRoutes)


export default app;