import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../interfaces/user";
import User from '../models/user';

export const authenticate = async (req, res, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("Bạn phải đăng nhập để thực hiện hành động này");

        const token = authHeader && authHeader.split(" ")[1] as string;
        const secretKey: string = process.env.JWT_SECRET!;

        const { id } = jwt.verify(token, secretKey) as JwtPayload
        const user = await User.findById(id) as IUser;
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }
        req.user = user
        next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};