const asyncHandler=require('../utils/asyncHandler')
const ApiError=require('../utils/ApiError')
const ApiResp=require('../utils/ApiResponse')
const User=require('../model/user.model')
const uploadOnCloudinary=require('../utils/cloudinary')

const generateAccessAndRefreshToken=async(userId)=>{
    try {
       const user=await User.findById(userId) 
       const AccessToken=await user.AccessToken();
       const refreshToken=await user.refershToken();

       user.refreshToken=refreshToken
       user.save({validateBeforeSave:false})

       return {AccessToken,refreshToken}

    } catch (error) {
        throw new ApiResp(400,"server side error")
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

    const {AccessToken,refershToken}=generateAccessAndRefreshToken(user._id)
    
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

     const option={
        httpOnly:true,
        secure:true
     }

     res.status(200)
     .cookie("refreshToken",refershToken,option)
     .cookie("accessToken",AccessToken,option)
     .json(
        new ApiResp(
            200,
            {
                user:loggedInUser,AccessToken,refershToken
            },
             "User logged In Successfully"
        )
     )
})

module.exports=registerUser 