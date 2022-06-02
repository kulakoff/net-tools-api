require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
const { router } = require("./router");
const { errorMiddleware } = require("./middlewares/errorMiddleware");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, "http://localhost:3001", "http://192.168.88.25:3001"],
  })
);
app.use("/api/v1/", router); //"/api/v1/",
//TODO: переделать заглушку для не валидных запросов
// app.use("*", (req, res) => res.sendStatus(400));
app.use(errorMiddleware);

const start = async () => {
  try {
    // await mongoose.connect(process.env.DB_URL_AUTH, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    app.listen(PORT, () => {
      console.log(`server started on port 0.0.0.0:${PORT}`);
      console.log(`ENV_TARGET: ${process.env.ENV_TARGET}`)
    });
  } catch (e) {
    console.log(e);
  }
};

start();
