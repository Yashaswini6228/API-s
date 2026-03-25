import User from '../model/userModel.js';

export const create = async (req, res) => {
    try {
        const userData = req.body;
        
        // If file was uploaded, add filename to userData
        if (req.file) {
            userData.resume = req.file.filename;
        }
        
        const newUser = new User(userData);
        const {email} = newUser;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({Message: 'User with this email already exists' });
        }
        const savedData = await newUser.save();
        res.status(201).json({ message: "User created successfully", data: savedData });


    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try{
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(404).json({ Message: 'No users found' });
        }
        res.status(200).json(userData);

    }catch(error){
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
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Check password (you should use bcrypt in production)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.status(200).json({ message: 'Login successful', data: user });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};