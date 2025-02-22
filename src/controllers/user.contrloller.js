const asyncHandler=require('../utils/asyncHandler')
const ApiError=require('../utils/ApiError')
const ApiResp=require('../utils/ApiResponse')
const User=require('../model/user.model')
const uploadOnCloudinary=require('../utils/cloudinary')


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

    const existedUser=await User.find({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user already existed")
    }

    const avatarLocalpath=req.files?.avatar[0]?.path;
    const coverImageLocalpath=req.files?.coverImage?.path;

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

module.exports=registerUser 