import User from "../models/users";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/password";
import { generateToken } from "../middlewares/jwtTokens";

export const registerUser = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        res.status(400).json({ message: "Please fill in all fields" });
        return; 
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
        res.status(400).json({
            message: "Please enter a valid email"
        });
        return; 
    }

    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!validPassword.test(password)) {
        res.status(400).json({
            message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
        });
        return; 
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const hashedPassword = await hashPassword(password as string);
    
    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber
        });

        if (!user) {
            res.status(400).json({ message: "Failed to create user" });
            return; 
        }

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



export const LoginUser = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.json({
            status: 400,
            message:"Provide the Required fields"
        })
    }
    const user = await User.findOne({email})
    if(!user){
        res.json({
            status: 400,
            message:"User not found"})
    }
    const validPassword = await comparePassword(password, user?.password as string)
    if(!validPassword){
        res.json({
            status: 400,
            message:"Invalid Password"
        })
    }
    const userId = user?._id.toString() as string
    try {
        const token = generateToken(email, userId );
        res.cookie('access_token',token,{
            httpOnly: true,
            sameSite:"none",
            secure: true,
            expires: new Date(Date.now() + 360000)
        })
    } catch (error) {
        console.error(error);
    }
    res.json({
        status: 200,
        message:`You are logged in successfully ${user?.name}`
    })
})


export const updateUser = expressAsyncHandler(async(req:Request,res:Response)=>{
    const {name,email,password} = req.body
    const user = await User.findOne({ email: req?.user?.email })
    if(!user){
        res.json({
            status: 400,
            message:"User not found"
        })
        return;
    }
    if (user) {
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }
    }
      try{

       await user.save();
        res.json({
            status: 200,
            message:"User updated successfully"
        })
    } catch (error) {
        res.json({
            status: 500,
            message:"Internal server error"
        })
    }
})
    