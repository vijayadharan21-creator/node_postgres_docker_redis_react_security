import jwt from "jsonwebtoken";
import { accesssecret } from "../config/env.config.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, accesssecret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};