const registerUser=require('../controllers/user.contrloller')
const multer=require('../middlewares/multer')

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

module.exports=router;