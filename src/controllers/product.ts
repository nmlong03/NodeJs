
import { Request, Response } from "express";
import { IProduct, IProductResponse } from "../interfaces/product";
import { IUser } from "../interfaces/user";
import Category from '../models/category';
import Product from "../models/product";
import { productSchema } from "../schemas/product";

export const getAll = async (req: Request, res: Response) => {
    const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", _expand } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
    };
    const populateOptions = _expand ? [{ path: "categoryId", select: "name" }] : [];
    try {
        const result = await Product.paginate({ categoryId: null }, { ...options, populate: populateOptions }) as {
            docs: IProduct[];
            page: number;
            totalPages: number;
            totalDocs: number;
        };
        if (result.docs.length === 0) throw new Error("No products found");
        const response: IProductResponse = {
            data: result.docs,
            pagination: {
                currentPage: result.page,
                totalPages: result.totalPages,
                totalItems: result.totalDocs,
            },
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
export const get = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) throw new Error("Product not found");
        return res.status(200).json({ data: product });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
export const create = async (req: Request, res: Response) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((message) => ({ message }));
            return res.status(400).json({ errors });
        }
        // Thêm sản phẩm vào database
        const product = await Product.create(req.body);

        await Category.findOneAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id
            }
        })
        return res.status(200).json({
            product,
        });
    } catch (error) {
        return res.status(400).json({
            message: "Thêm sản phẩm không thành công",
            error: error.message
        });
    }
};
export const update = async (req: Request, res: Response) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                messages: error.details.map((message) => ({ message }))
            });
        }
        // Tìm sản phẩm theo id và cập nhật dữ liệu mới
        const productId = req.params.id;
        const updatedProduct = await Product.findOneAndUpdate({ _id: productId }, req.body, { new: true });
        if (!updatedProduct) {
            return res.sendStatus(404);
        }

        // Xóa sản phẩm cũ khỏi danh sách products của category cũ
        const oldCategoryId = updatedProduct.categoryId;
        await Category.findByIdAndUpdate(
            oldCategoryId,
            { $pull: { products: productId } }
        );

        // Thêm sản phẩm mới vào danh sách products của category mới
        const newCategoryId = req.body.categoryId;
        if (newCategoryId) {
            // Thêm sản phẩm mới vào danh sách products của category mới
            await Category.findByIdAndUpdate(
                newCategoryId,
                { $addToSet: { products: productId } }
            );
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({
            message: "Cập nhật sản phẩm không thành công",
            error: error.message,
        });
    }
};
export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { isHardDelete } = req.body;
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((message) => ({ message }));
            return res.status(400).json({ errors });
        }
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        // Nếu client gửi lên isHardDelete = true thì xóa sản phẩm vĩnh viễn
        // Ngoài ra xóa luôn id sản phẩm khỏi danh sách products ở category
        if (isHardDelete) {
            await product.forceDelete();
            // Xóa sản phẩm cũ khỏi danh sách products của category cũ
            await Category.findByIdAndUpdate(
                product.categoryId,
                { $pull: { products: product._id } }
            );
        } else {
            await product.delete()
        }

        return res.status(200).json({
            message: "Xóa sản phẩm thành công",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            message: "Xóa sản phẩm thất bại",
            error: error.message,
        });
    }
};
export const restore = async (req, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = req.user as IUser;
        const product = await Product.findById(id) as IProduct;

        if (!user.role || user.role !== "admin") {
            return res.status(403).json({
                message: "Bạn không có quyền phục hồi sản phẩm",
            });
        }
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        if (!product.deleted) {
            return res.status(400).json({
                message: "Sản phẩm chưa bị xóa mềm",
            });
        }

        product.deleted = false;
        product.deletedAt = null;

        const restoredProduct = await product.save();

        return res.status(200).json({
            message: "Phục hồi sản phẩm thành công",
            data: restoredProduct,
        });
    } catch (error) {
        res.status(400).json({
            message: "Phục hồi sản phẩm không thành công",
            error: error.message
        });
    }
};
