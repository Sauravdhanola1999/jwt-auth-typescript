import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      userId: string;
      email: string;
      role: "user" | "admin";
    }

    interface Request {
      user: UserPayload;
    }
  }
}

export {};