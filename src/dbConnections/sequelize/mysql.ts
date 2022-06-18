import { Dialect, Sequelize } from "sequelize";

//db connect options
const dbName = process.env.SEQUELIZE_DB_NAME as string;
const dbUser = process.env.SEQUELIZE_DB_USER as string;
const dbHost = process.env.SEQUELIZE_DB_HOST;
const dbDriver = process.env.SEQUELIZE_DB_DRIVER as Dialect;
const dbPassword = process.env.SEQUELIZE_DB_PASSWORD as string;

export const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelizeConnection;
