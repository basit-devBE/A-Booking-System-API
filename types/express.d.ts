// // types/express.d.ts (or any appropriate name)
import 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User; // Adjust the type based on your user object structure
//       headers: {
//         cookie?: string; // Cookie is part of the headers and is a string
//       };
//     }
//   }
// }

declare module "express" {
  export interface Request {
    user?: any;
    headers: {
      cookie?: string;
    };
    // [key:string]: any
  }
}
