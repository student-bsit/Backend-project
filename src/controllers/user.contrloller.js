const asyncHandler=require('../utils/asyncHandler')
const ApiError=require('../utils/ApiError')
const ApiResp=require('../utils/ApiResponse')
const User=require('../model/user.model')
const uploadOnCloudinary=require('../utils/cloudinary')
const jwt=require('jsonwebtoken')
const ApiErr = require('../utils/ApiError')

const a = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateaccessToken()
        const refreshToken = user.generaterefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    //get user details from frontend
    //valdate not empty
    //check if user already exists: username,email
    //check for images and avatar
    //upload them to cloudnary, avatar
    //create user object, create an entry in db
    //remove password and refresh token from response
    //check for user creation 
    //return res

    const {username,email,password,fullname}=req.body

    if(
        [username,email,password,fullname].some((field)=>field?.trim()=="")
    ){
        throw  new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user already existed")
    }

    const avatarLocalpath=req.files?.avatar[0]?.path;
   // const coverImageLocalpath=req.files?.coverImage[0]?.path;

   let coverImageLocalpath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalpath=req.files.coverImage[0].path;
   }

    if(!avatarLocalpath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalpath)
    const coverImage=await uploadOnCloudinary(coverImageLocalpath)

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password,
        email,
        username:username.toLowerCase()
    })

    const createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResp(200,createdUser,"user created successfully")
    )

})



const loginUser=asyncHandler(async(req,res)=>{
    //req->body data
    //username or email
    //find user
    //password check
    // generate access and refresh token
    // send cookie

    const {username,email,password}=req.body

    if(!username && !email){
       throw new ApiResp(400,"user not found")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiResp(200,"user not found")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiResp(200,"wrong credentials")
    }

    console.log("User ID before generating tokens:", user._id);
    const {accessToken,refreshToken}= await a(user._id)
    
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

     const option={
        httpOnly:true,
        secure:true
     }

     res.status(200)
     .cookie("refreshToken",refreshToken,option)
     .cookie("accessToken",accessToken,option)
     .json(
        new ApiResp(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
             "User logged In Successfully"
        )
     )
})


const logoutUser=asyncHandler(async(req,res)=>{

    await User.findByIdAndUpdate(req._id,
        {
          $set:{
            refreshToken:undefined
          }  
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearcookie("accesstoken",options)
    .clearcookie("rereshToken",options)
    .json(
        new ApiResp(
            200,
            {},
            "user logged out successfully"
        )
    )
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingToken=req.cookies.refreshToken 
    
        if(!incomingToken){
            throw new ApiError(401,"unauthorized access")
        }
    
        const decodedToken=jwt.verify(incomingToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
       const user=await User.findById(decodedToken._id)
    
       if(!user){
        throw new ApiError(401,"unauthorized access")
       }
    
       if(!incomingToken==user?.refreshToken){
        throw new ApiError(401,"unauthorized access")
       }
    
    const options={
        htttpOnly:true,
        secure:true
    }
    
    const {accessToken,refreshToken}=await a(user._id)
    
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResp(
            200,
            {
                accessToken,refreshToken
            },
            "Access token refreshed"
        )
    )
}
    catch (error) {
        
    }
})
module.exports={registerUser,loginUser,logoutUser} 