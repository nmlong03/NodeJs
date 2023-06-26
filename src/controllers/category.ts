import Category from "../models/category";
import { Request, Response } from 'express';

export const getCate = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", _embed } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { [_sort as string]: _order === "desc" ? -1 : 1 },
    };
    const populateOptions = _embed ? [{ path: "categoryId", select: "name" }] : [];
    try {
        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        const result: any = await Category.paginate(
            { categoryId },
            { ...options, populate: populateOptions }
        );

        if (result.docs.length === 0) {
            return res.status(404).json({
                message: "No products found in this category",
            });
        }
        if (_embed) {
            return res.json({
                data: {
                    category,
                    products: result.docs,
                },
                pagination: {
                    currentPage: result.page,
                    totalPages: result.totalPages,
                    totalItems: result.totalDocs,
                },
            });
        } else {
            return res.status(200).json({
                data: result.docs,
                pagination: {
                    currentPage: result.page,
                    totalPages: result.totalPages,
                    totalItems: result.totalDocs,
                },
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        if (!category.isDeleteable) {
            return res.status(400).send({ message: 'Không thể xóa danh mục này' });
        }
        return res.status(200).json({
            message: "Xóa danh mục thành công",
            category
        });
    } catch (error) {
        res.status(400).json({
            message: "Xóa sản phẩm thất bại",
            error: error.message,
        });
    }

}
