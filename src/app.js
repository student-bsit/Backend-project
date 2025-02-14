const express=require('express');

const app=express();

const cookieParser=require('cookie-parser')
const cors=require('cors')

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//inbuilt middleware of express
app.use(express.json({limit:"12kb"}))

app.use(express.urlencoded({
    extended:true,
    limit:"12kb"
}))

app.use(express.static("public"))

app.use(cookieParser())


module.exports=app