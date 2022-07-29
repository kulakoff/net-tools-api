require("dotenv").config();
import ip from "ip";
import morgan from "morgan";
import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";

import { router } from "./router";
import errorMiddleware from "./middlewares/errorMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";

//Utils

//Планировщик, опрос API в отчетный период 25 числа кажого месяца и сохранение данные в БД
import seeder from "./utils/seeder";
import ApiError from "./exceptions/apiError";
seeder.start();

const PORT = (process.env.PORT as string) || "5000";
const app: Application = express();

//Middlewares:
// 1. Disable x-bowered-by
app.disable("x-powered-by");

// 2. Body parser
app.use(express.json({ limit: "10kb" }));

// 3. Cookie parser
app.use(cookieParser());

// 4. Logger
if (process.env.NODE_ENV === "dev") app.use(morgan("dev"));

// 5. Cors
app.use(corsMiddleware);

// 6. Rate limit
app.use(rateLimitMiddleware);

// Routes
app.use("/api/v1/", router);
app.use("/reports", express.static("./reports"));

// UnKnown Routes
// TODO: переделать заглушку для не валидных запросов
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    ApiError.NotFound("Unknown routes", [
      `Route '${req.originalUrl}' not found`,
    ])
  );
});

// Global Error Handler
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 NODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`Server started on  http://${ip.address()}:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
