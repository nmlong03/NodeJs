import express, { Router } from "express";
import { getCate, remove } from "../controllers/category";

const router: Router = express.Router();


router.get("/categories", getCate);
router.delete("/categories", remove);
export default router;
