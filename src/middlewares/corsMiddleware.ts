require("dotenv").config();
import cors from "cors";
//TODO переделать
const host1:string  = process.env.CLIENT_URL || "http://localhost:3000"
const host2:string  = process.env.CLIENT_URL2 || "http://192.198.13.20:3000"

const corsMiddleware =   cors({
  credentials: true,
  origin: [host1, host2],
})
export default  corsMiddleware ;