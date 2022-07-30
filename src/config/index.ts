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

const defaultValue = {
  mongo: "",
};

export const appConfig = {
  env: NODE_ENV,
  port: PORT || "5000",
  mongoURLs:
    NODE_ENV === "dev"
      ? {
          auth: MONGODB_URI_AUTH_DEV || defaultValue.mongo,
          cpe: MONGODB_URI_CPE_DEV || defaultValue.mongo,
        }
      : {
          auth: MONGODB_URI_AUTH || defaultValue.mongo,
          cpe: MONGODB_URI_CPE || defaultValue.mongo,
        },
  REDIS_URL: REDIS_URL || "redis://localhost:6379",
  zabbix: {
    host: ZABBIX_HOST,
    usename: ZABBIX_USERNAME,
    password: ZABBIX_PASSWORD,
  },
  telegran: {
    token: TELEGRAM_TOKEN || "token_example",
    chatId: TELEGRAM_CHAT_ID || "chat_id_example",
  },
  jwt: {
    accessSecret: JWT_ACCESS_SECRET,
    refresSecret: JWT_REFRESH_SECRET,
    accessExpiresIn: JWT_ACCESS_EXPIRESIN,
    refreshExpiresIn: JWT_REFRESH_EXPIRESIN,
  },
};
