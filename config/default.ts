import "dotenv/config";
const {
  NODE_ENV,
  PORT,
  MONGODB_URI_AUTH,
  MONGODB_URI_CPE,
  MONGODB_URI_AUTH_DEV,
  MONGODB_URI_CPE_DEV,
  REDIS_URL,
  ZABBIX_HOST,
  ZABBIX_USERNAME,
  ZABBIX_PASSWORD,
  TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRESIN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRESIN,
} = process.env;

export default {
  port: PORT || 5000,
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  deviceIdExpiresIn: 365,
  origin: "http://localhost:3000",
};
