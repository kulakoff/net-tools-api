const { Schema, model } = require("mongoose");
const { authConnection } = require("../dbConnections/connections");

const TokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, require: true },
  },
  {
    // collection: "tokens",
    versionKey: false,
  }
);

const TokenModel = authConnection.model("Token", TokenSchema, "tokens");
module.exports = { TokenModel };
