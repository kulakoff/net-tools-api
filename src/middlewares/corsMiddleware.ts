require("dotenv").config();
import cors from "cors";

import { allowedOrigins } from "../config/allowedOrigins";

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

//TODO переделать
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;