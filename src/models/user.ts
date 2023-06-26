import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user";
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: Schema.Types.String,
            minLength: 6,
            maxLength: 255,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        }
    },
    { timestamps: true, versionKey: false }
);
export default mongoose.model("User", userSchema);
