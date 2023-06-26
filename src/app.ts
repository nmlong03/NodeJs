import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import connectDB from "./config/database";
import cors from 'cors';
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import uploadRouter from "./routes/upload";
import categoryRouter from "./routes/category";

const app: Application = express();


// Khởi tạo kết nối với cơ sở dữ liệu
connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use(cors())

app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);
app.use("api", categoryRouter)
mongoose.connect("mongodb://127.0.0.1:27017/nodejs");

export const viteNodeApp: Application = app;
