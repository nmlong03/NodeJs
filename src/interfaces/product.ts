import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description?: string;
    categoryId: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    deleted?: boolean;
    forceDelete: () => Promise<void>;
}
export interface IProductResponse {
    data: IProduct[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}