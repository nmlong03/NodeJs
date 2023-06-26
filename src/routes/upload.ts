import express from "express";
import multer from "multer";
import { deleteImage, updateImage, uploadImage } from "../controllers/upload";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
const router = express.Router();

interface CloudinaryParams {
    folder: string;
    format: string;
    // các thuộc tính khác của `Params` nếu cần
}
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "WE17301",
        format: "png",
    } as CloudinaryParams
});

const upload = multer({ storage: storage });


router.post("/images/upload", upload.array("images", 10), uploadImage);
router.delete("/images/:publicId", deleteImage);
router.put("/images/:publicId", upload.array("images", 10), updateImage);

export default router;