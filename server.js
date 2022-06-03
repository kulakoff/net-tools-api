require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { router } = require("./router");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
const { rateLimitMiddleware } = require("./middlewares/rateLimitMiddleware");
const { corsMiddleware } = require("./middlewares/corsMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();

const ip = require("ip");

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

app.use("/api/v1/", router); //"/api/v1/",

//TODO: переделать заглушку для не валидных запросов
// app.use("*", (req, res) => res.sendStatus(400));

app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server started on  http://${ip.address()}:${PORT}`);
      console.log(`ENV_TARGET: ${process.env.ENV_TARGET}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
