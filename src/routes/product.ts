import express, { Router } from "express";
import { create, get, getAll, remove, restore, update } from "../controllers/product";
import { authorization, } from "../middlewares/authorization";
import { authenticate } from "../middlewares/authenticate";

const router: Router = express.Router();
router.get('/products', getAll);
router.get("/products/:id", get);
router.post("/products/:id", create);
router.patch("/products/:id", restore)
router.put("/products/:id", update)
router.delete("/products/:id", remove)

export default router;