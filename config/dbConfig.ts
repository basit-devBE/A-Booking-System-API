import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MongodbUri;
if (!mongoUri) {
    throw new Error("MongodbUri is not defined in the environment variables");
}

const dbConfig = async () =>{
    try {
        await mongoose.connect(mongoUri, {
        });
        console.log("Database connected");
    } catch (error) {
        console.error(error);    }
}

export default dbConfig;
