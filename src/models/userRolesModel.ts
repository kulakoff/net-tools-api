import { Schema } from "mongoose";
import { authConnection } from "../dbConnections/connections";

const RolesSchema = new Schema({
    value: { type: String, unique: true, default: "user" },
}, {
    versionKey: false,
    timestamps: true,
    // collection: "users"
})



const RolesModel = authConnection.model("Roles", RolesSchema, "roles");
export default RolesModel;