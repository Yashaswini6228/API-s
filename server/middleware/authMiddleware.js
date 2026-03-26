import jwt from "jsonwebtoken";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token expired" });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No token" });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
};

export default verifyAccessToken;