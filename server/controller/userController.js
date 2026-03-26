import User from '../model/userModel.js';
import jwt from "jsonwebtoken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";

export const create = async (req, res) => {
    try {
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobileNumber: req.body.mobileNumber,
            yearOfJoining: req.body.yearOfJoining,
            yearOfPassout: req.body.yearOfPassout || undefined,
            tenthPercentage: req.body.tenthPercentage ? Number(req.body.tenthPercentage) : undefined,
            resume: req.file ? req.file.filename : undefined,
            role: req.body.role || 'user'
        };

        Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

        const newUser = new User(userData);
        const { email } = newUser;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ Message: 'User with this email already exists' });
        }
        const savedData = await newUser.save();
        res.status(201).json({ message: "User created successfully", data: savedData });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(404).json({ Message: 'No users found' });
        }
        res.status(200).json(userData);

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({ Message: 'User not found' });
        }
        res.status(200).json(userExists);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const userExists = await User.findById(id);
        if (!userExists) {
            return res.status(404).json({ Message: 'User not found' });
        }
        const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ Message: 'User not found' });
        }
        res.status(200).json({ Message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        console.log('Generated Access Token:', accessToken);

        const refreshToken = generateRefreshToken(user._id);
        console.log('Generated Refresh Token:', refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token expired" });
        }

        const newAccessToken = generateAccessToken(decoded.userId);

        res.json({ accessToken: newAccessToken });  
    });
};