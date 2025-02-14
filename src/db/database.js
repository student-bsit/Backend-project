const mongoose =require('mongoose')
const {DB_NAME}=require('../constants.js');

const connectDB=async()=>{
    try {
        const instance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n Mongodb connected !! DB host: ${instance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

module.exports=connectDB;
