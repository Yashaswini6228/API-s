import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    yearOfJoining: {
        type: String,
        required: true
    },
    yearOfPassout: {
        type: String,
        required: false
    },
    tenthPercentage: {
        type: Number,
        required: false
    },
    resume: {
        type: String,
        required: false
    }
});

export default mongoose.model('User', userSchema);