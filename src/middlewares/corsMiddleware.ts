require("dotenv").config();
import cors from "cors";

import { allowedOrigins } from "../config/allowedOrigins";
//TODO переделать
const corsMiddleware = cors({
  credentials: true,
  origin: allowedOrigins,
});
export default corsMiddleware;
