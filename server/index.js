import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import route from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ dest: './uploads/' });
app.use(upload.single('resume'));


const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yashu';

mongoose.
    connect(MONGO_URI)
    .then(() =>{
     console.log('MongoDB connected')
     app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})

.catch((error) => console.log(error));

app.use(express.json()); 
app.use('/api', route);