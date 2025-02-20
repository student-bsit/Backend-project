const registerUser=require('../controllers/user.contrloller')

const express=require('express')
const router=express()

router.route("/register").post(registerUser)

module.exports=router;