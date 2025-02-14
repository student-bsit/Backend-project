
import dotenv from 'dotenv';
dotenv.config();


dotenv.config({
    path:"./env"
})

import connectDB from './db/database.js';

 connectDB();