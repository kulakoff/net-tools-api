const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    phone: { type: String, unique: true, require: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  { versionKey: false, collection: "users" }
);

module.exports = model("User", UserSchema);
