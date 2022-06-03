require("dotenv").config();
const cors = require("cors");

const corsMiddleware =   cors({
  credentials: true,
  origin: [process.env.CLIENT_URL, process.env.CLIENT_URL2],
})
module.exports = { corsMiddleware };
