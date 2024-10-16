import express from "express";
import dotenv from "dotenv";
import dbConfig from "./config/dbConfig";
import morgan from "morgan";
import UserRouter from "./routes/userRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

dbConfig();

const app = express();

if (process.env.ENVIRONMENT === "development") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use(UserRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
