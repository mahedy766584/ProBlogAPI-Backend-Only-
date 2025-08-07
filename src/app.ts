import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: ['http://localhost:5173'], credentials: true}));

//application routes;
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send('HELLO BLOG API!')
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
