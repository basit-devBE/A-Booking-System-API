import express from "express";
import dotenv from "dotenv";
import dbConfig from "./config/dbConfig";
import morgan from "morgan";
import UserRouter from "./routes/userRoutes";
import cookieParser from "cookie-parser";
import bookingRouter from "./routes/bookingRoutes";

dotenv.config();

dbConfig();

const app = express();

if (process.env.ENVIRONMENT === "development") {
    app.use(morgan("combined"));
}

app.use(express.json());
app.use(cookieParser());
app.use(UserRouter);
app.use(bookingRouter);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
