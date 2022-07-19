require("dotenv").config();
import ip from "ip";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";

import { router } from "./router";
import errorMiddleware from "./middlewares/errorMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";

//Utils 

//Планировщик, опрос API в отчетный период 25 числа кажого месяца и сохранение данные в БД
import seeder from "./utils/seeder";
seeder.start()

const PORT = process.env.PORT as string || "5000"
const app: Application = express();

//Middlewares:
app.disable('x-powered-by');  
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

app.use("/api/v1/", router); //"/api/v1/",

app.use('/reports', express.static('./reports'));

// TODO: переделать заглушку для не валидных запросов
app.use("*", (req: Request, res: Response) => res.sendStatus(400));

app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`ENV_TARGET: ${process.env.ENV_TARGET}`);
      console.log(`🚀 Server started on  http://${ip.address()}:${PORT}`);
     
    });
  } catch (e) {
    console.log(e);
  }
};

start();
