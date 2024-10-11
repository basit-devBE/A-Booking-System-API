import User from "../models/users";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { hashPassword } from "../utils/password";

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
