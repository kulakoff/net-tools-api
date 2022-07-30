import { appConfig } from "../config";
import { createConnection } from "mongoose";

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
    console.log(error);
    console.log(`MongoDB :: connection ${db.name} :: ${new Date().toLocaleString("RU")} :: ${JSON.stringify(error)}`);
    db.close().catch(() =>
      // console.log(`MongoDB :: failed to close connection ${this.name}`)
      console.log("MongoDB :: failed to close connection ", error)
    );
  });

  db.on("connected", () => {
    console.log(`MongoDB :: connected ${db.name} :: ${new Date().toLocaleString("RU")}`);

    // db.set("debug", function (col:any, method:any, query:any, doc:any) {
    //   console.log(
    //     `MongoDB :: ${db.name} ${col}.${method}(${JSON.stringify(
    //       query
    //     )},${JSON.stringify(doc)})`
    //   );
    // });  
  });

  db.on("disconnected", () => {
    console.log(`MongoDB :: disconnected ${db.name} :: ${new Date().toLocaleString("RU")}`);
  });

  return db;
};

const authConnection = makeNewConnection(appConfig.mongoURLs.auth);
const deviceConnection = makeNewConnection(appConfig.mongoURLs.cpe);

export { authConnection, deviceConnection };
