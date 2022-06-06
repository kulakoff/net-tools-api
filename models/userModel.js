const { Schema } = require("mongoose");
const { authConnection } = require("../dbConnections/connections");

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, require: true },
    phoneNumber: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  {
    versionKey: false,
    timestamps: true 
    // collection: "users"
  }
);

const UserModel = authConnection.model("User", UserSchema, "users");
module.exports = { UserModel };
