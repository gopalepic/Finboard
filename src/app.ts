import express from "express";
import stocksRoutes from "./modules/stocks/stocks.route";
import cors from "cors";
const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());
app.use(cors());
app.use('/api/stocks', stocksRoutes)


export default app;