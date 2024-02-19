// Packages import
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import 'express-async-errors'

// files imports
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userAuth from "./middlewares/authMiddleware.js";

// Dot env Config
dotenv.config();

// Databse Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/test", userAuth ,testRoutes);
app.use("/api/v1/auth", authRoutes);

// validation  or error middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`.bgCyan.white);
});
