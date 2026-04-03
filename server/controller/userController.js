import User from '../model/userModel.js';
import jwt from "jsonwebtoken";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";



const loginAttempts = {}; 

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000;


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

export const getUsersWithFilters = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            query = "",
            role = "",
            sortBy = "createdAt",
            sortOrder = "desc"
        } = req.query;

        const filter = { $and: [] };
        const q = typeof query === "string" ? query.trim() : String(query ?? "").trim();

      
        if (q) {
            filter.$and.push({
                $or: [
                    { name: { $regex: q, $options: "i" } },
                    { email: { $regex: q, $options: "i" } },
                ]
            });
        }

 
        if (role && role !== "") {
            filter.$and.push({ role });
        }

        const finalFilter = filter.$and.length > 0 ? filter : {};

     
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 5;
        const skip = (pageNum - 1) * limitNum;

        
        const sortObject = {};
        sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;

        const [users, total] = await Promise.all([
            User.find(finalFilter)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(finalFilter),
        ]);

        return res.status(200).json({
            users,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            hasSearch: !!q,
            hasFilters: !!role,
        });
    } catch (error) {
        console.error("Error fetching users with filters:", error);
        return res.status(500).json({
            users: [],
            total: 0,
            page: 1,
            limit: 5,
            totalPages: 0,
            hasSearch: false,
            hasFilters: false,
            errorMessage: error.message
        });
    }
};

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

        
        const userAttempts = loginAttempts[email] || { count: 0, lockUntil: null };

    
        if (userAttempts.lockUntil && Date.now() < userAttempts.lockUntil) {
            const remainingTime = Math.ceil((userAttempts.lockUntil - Date.now()) / 1000);
            return res.status(403).json({
                message: `Account locked. Try again in ${remainingTime} seconds`
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            
            userAttempts.count += 1;
            loginAttempts[email] = userAttempts;

            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts: MAX_ATTEMPTS - userAttempts.count
            });
        }

        if (user.password !== password) {
           
            userAttempts.count += 1;

         
            if (userAttempts.count >= MAX_ATTEMPTS) {
                userAttempts.lockUntil = Date.now() + LOCK_TIME;
                userAttempts.count = 0;
            }

            loginAttempts[email] = userAttempts;

            return res.status(401).json({
                message: 'Invalid credentials',
                remainingAttempts: MAX_ATTEMPTS - userAttempts.count
            });
        }

       
        loginAttempts[email] = { count: 0, lockUntil: null };

    
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
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const userAttempts = loginAttempts[email] || { count: 0, lockUntil: null };

  // 🔒 Check lock
  if (userAttempts.lockUntil && Date.now() < userAttempts.lockUntil) {
    return res.status(403).json({
      message: "Account locked. Try again later"
    });
  }

  const user = await findUser(email); 

  if (!user || user.password !== password) {
    userAttempts.count += 1;

    if (userAttempts.count >= MAX_ATTEMPTS) {
      userAttempts.lockUntil = Date.now() + LOCK_TIME;
      userAttempts.count = 0;
    }

    loginAttempts[email] = userAttempts;

    return res.status(401).json({
      message: "Invalid credentials",
      remainingAttempts: MAX_ATTEMPTS - userAttempts.count
    });
  }

  loginAttempts[email] = { count: 0, lockUntil: null };

  res.json({ message: "Login successful" });
};