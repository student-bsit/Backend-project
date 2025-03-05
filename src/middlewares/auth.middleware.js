const jwt=require('jsonwebtoken')
const User=require('../model/user.model')
const ApiError = require('../utils/ApiError')
const asyncHandler=require('../utils/asyncHandler')


const verifyJwt= asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken 
        console.log("token is :",token)
        if(!token){
            throw new ApiError(401,"invalid user")
        }
    
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET) 
    
        const user=await User.findById(decodedToken?._id).select("-password,-refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user=user
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token")
    }
})

module.exports=verifyJwt