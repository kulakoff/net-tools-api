import ip from "ip";
import morgan from "morgan";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { router } from "./router";
import { appConfig } from "./config";
import errorMiddleware from "./middlewares/errorMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import corsMiddleware from "./middlewares/corsMiddleware";
import notMatchRoutes from "./middlewares/notMatchRoutes";
import seeder from "./utils/seeder";

const app: Application = express();

//Middlewares:

// 1. Disable x-bowered-by
app.disable("x-powered-by");

// 2. Body parser
app.use(express.json({ limit: "10kb" }));

// 3. Cookie parser
app.use(cookieParser());

// 4. Logger
app.use(morgan(appConfig.env === "dev" ? "dev" : "short"));

// 5. Cors
app.use(corsMiddleware);

// 6. Rate limit
app.use(rateLimitMiddleware);

// Routes
app.use("/api/v1/", router);

//Report directory. Not used!
app.use("/reports", express.static("./reports"));

// UnKnown Routes
// TODO: переделать заглушку для не валидных запросов
app.use("*", notMatchRoutes);

// Global Error Handler
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(appConfig.port, () => {
      console.log(`🚀 NODE_ENV: ${appConfig.env}`);
      console.log(`Server started on http://${ip.address()}:${appConfig.port}`);
      seeder.start();
    });
  } catch (e) {
    console.log(e);
  }
};

start();
