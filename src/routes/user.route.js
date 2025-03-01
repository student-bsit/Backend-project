const {registerUser,loginUser,logoutUser}=require('../controllers/user.contrloller')
const multer=require('../middlewares/multer')
const authjwt=require('../middlewares/auth.middleware')

const express=require('express')
const router=express()

router.route("/register").post(
    //midddleware
    multer.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    router.route("/logout").post(authjwt,  logoutUser)
    

module.exports=router;