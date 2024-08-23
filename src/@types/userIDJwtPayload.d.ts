import jwt from "jsonwebtoken";

export interface UserIDJwtPayload extends jwt.JwtPayload {
    userId: string
}