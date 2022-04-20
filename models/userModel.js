const { Schema } = require("mongoose");
const { authConnection } = require("../dbConnections/connections");

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    phone: { type: String, unique: true, require: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  {
    versionKey: false,
    // collection: "users"
  }
);

const UserModel = authConnection.model("User", UserSchema, "users");
module.exports = { UserModel };
