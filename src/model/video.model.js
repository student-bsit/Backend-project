const {mongoose,Schema}=require('mongoose')

const videoSchema=new Schema(
    {
        videofile:{
            type:String, //cloudnary url
            required:true
        },
        thumbnail:{
            type:string, //cloudnary url
            required:true
        },
        title:{
            type:string, 
            required:true
        },
        description:{
            type:string, 
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            Userref:"User"
        }
    }
    ,{timestamps:true})


    module.exports=mongoose.model('Video',videoSchema)