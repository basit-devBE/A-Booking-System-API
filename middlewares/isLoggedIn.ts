import User from "../models/users";
// import { getTokenFromCookies, verifyToken } from "./jwtTokens";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from 'jsonwebtoken';
import  jwt  from 'jsonwebtoken';


// Extend Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type as needed
    }
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded;
      next();
  } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
  }
}

