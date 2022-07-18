require("dotenv").config();
import { createConnection, } from "mongoose";

const mongoseeOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};

const makeNewConnection = (uri: string) => {
  const db = createConnection(uri, mongoseeOptions);

  db.on("error", (error) => {
    // console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
    db.close().catch(() =>
      // console.log(`MongoDB :: failed to close connection ${this.name}`)
      console.log("MongoDB :: failed to close connection ", error)
    );
  });

  db.on("connected", () => {
    // mongoose.set("debug", function (col, method, query, doc) {
    //   console.log(
    //     `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
    //       query
    //     )},${JSON.stringify(doc)})`
    //   );
    // });
    //
    // console.log(`MongoDB :: connected ${this.name}`);
  });

  db.on("disconnected", () => {
    console.log(`MongoDB :: disconnected `);
    // console.log(`MongoDB :: disconnected ${this.name}`);
  });

  return db;
};

const authConnection = makeNewConnection(process.env.DB_URL_AUTH || "");
const deviceConnection = makeNewConnection(process.env.DB_URL_CPE || "");

export  {
  authConnection,
  deviceConnection,
};
