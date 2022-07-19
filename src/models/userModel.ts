//mongoose model user

import { Schema } from "mongoose";
import { authConnection } from "../dbConnections/connections";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, require: true },
    phoneNumber: { type: String, unique: true, require: false },
    password: { type: String, require: true },
    isActivated: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    activationLink: { type: String },
    roles:{}
  },
  {
    versionKey: false,
    timestamps: true,
    // collection: "users"
  }
);

const UserModel = authConnection.model("User", UserSchema, "users");
export default UserModel;
