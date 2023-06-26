import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";

const plugins = [mongoosePaginate, mongooseDelete];

interface ICategory {
    name: string;
    products: mongoose.Types.ObjectId[];
    isDeleteable: boolean;
}

const categorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: true,
    },
    // trường này để xác định nếu là false thì không thể xóa - dành cho uncategory
    isDeleteable: {
        type: Boolean,
        default: true
    },
    products: [
        { type: mongoose.Types.ObjectId, ref: "Product" }
    ]
}, { timestamps: true, versionKey: false });

// Trước khi xóa category, cập nhật lại category của các sản phẩm thuộc category này thành uncategory
categorySchema.pre("findOneAndDelete", async function (next) {
    try {
        // Lấy model Product từ biến đã import
        const Product = mongoose.model("Product");
        //  lấy điều kiện tìm kiếm hiện tại của câu lệnh, xác định category mà đang được xóa trong trường hợp này.
        const filter = this.getFilter();
        //kiểm tra xem câu lệnh truy vấn có chứa trường categoryId được cập nhật không, nếu có lấy giá trị của trường đó để cập nhật cho các sản phẩm có cùng categoryId.
        const categoryId = this.getQuery().$set?.categoryId;
        const update = {
            categoryId: categoryId ?? "uncategorized",
        };
        await Product.updateMany(
            { categoryId: filter._id }, // Tìm các sản phẩm cùng categoryId
            update // Cập nhật categoryId mới
        );
        next();
    } catch (err) {
        next(err);
    }
});



plugins.forEach((plugin) => {
    categorySchema.plugin(plugin);
});

export default mongoose.model<ICategory>("Category", categorySchema);
