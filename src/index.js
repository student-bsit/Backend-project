const dotenv=require('dotenv')
dotenv.config();

const app=require('./app.js')


const connectDB=require( './db/database.js');

 connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on port: ${process.env.PORT}`)
    })
 }).catch((err)=>{
    console.log("Mongodb connection error",errr);
 })