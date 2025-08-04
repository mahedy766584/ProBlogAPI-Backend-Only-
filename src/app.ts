import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";

app.use(express.json());
app.use(cors());

//application routes;
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send('HELLO BLOG API!')
});

export default app;
