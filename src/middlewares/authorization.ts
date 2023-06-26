import { NextFunction } from 'express';
export const authorization = async (req, res, next: NextFunction) => {
    try {
        const user = req.user;
        if (!(user.role === "admin")) {
            throw new Error("Bạn không có quyền để thực hiện hành động này");
        }
        next();

    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};
