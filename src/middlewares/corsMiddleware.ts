require("dotenv").config();
import cors from "cors";
//TODO переделать
const host1:string  = process.env.CLIENT_URL || "http://localhost:3000"
const host2:string  = process.env.CLIENT_URL2 || "http://192.198.13.20:3000"
const host3:string  = process.env.CLIENT_URL3 || "http://192.198.13.20:4000"

const corsMiddleware =   cors({
  credentials: true,
  origin: [host1, host2, host3],
})
export default  corsMiddleware ;
