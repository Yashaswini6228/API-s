import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import route from './routes/userRoutes.js';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();


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