//mongoose model token

import  Mongoose from "mongoose";
import { authConnection } from "../dbConnections/connections";

const TokenSchema = new Mongoose.Schema(
  {
    user: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    refreshToken:[String]
    // refreshToken: { type: String, require: true },
  },
  {
    // collection: "tokens",
    versionKey: false,
    timestamps: true,
  }
);

const TokenModel = authConnection.model("Token", TokenSchema, "tokens");
export default  TokenModel ;
