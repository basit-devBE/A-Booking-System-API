import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb"; 
dotenv.config();
import { Request, Response } from "express";
// import { getTokenFromCookies } from './jwtTokens';

const secret = process.env.JWT_SECRET as string; 

export const generateToken =  (email: string, id:string) => {
    try{
        const token =  jwt.sign({ email, id }, secret, {
            expiresIn: "24h",
        });
        return token; 
}catch(error){
    console.log(error);
}
};

