import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('HELLO BLOG API!')
})

export default app;
