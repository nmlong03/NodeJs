import { Request } from "express";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "member";
}
export interface IRequestWithUser extends Request {
    user: IUser;
}