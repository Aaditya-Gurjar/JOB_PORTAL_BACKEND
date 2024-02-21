// API DOCUMENTATION
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
// Packages import
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
// security packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// files imports
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userAuth from "./middlewares/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobsRoute.js";

// Dot env Config
dotenv.config();

// Swagger API Config
// swagger api options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node expresjs job portal application",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);
// Databse Connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/test", userAuth, testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

// homeroute root
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// validation  or error middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`.bgCyan.white);
});
