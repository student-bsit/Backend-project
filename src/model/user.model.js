const {mongoose,Schema}=require('mongoose')

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudnary url
            required:true
        },
        coverImage:{
            type:String, //cloudnary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,"password is required"]
        },
        refershToken:{
            type:string
        }
    }
    ,{timestamps:true})

    module.exports = mongoose.model('User', userSchema);