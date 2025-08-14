import { JwtPayload } from "jsonwebtoken";

export interface customJwtPayload extends JwtPayload {
    userId: string;
    userName: string;
    role: "superAdmin" | "admin" | "author" | "user";
};

declare global {
    namespace Express {
        interface Request {
            user: customJwtPayload,
        }
    }
};