const {mongoose,Schema}=require('express')
const { model } = require('mongoose')

const subscriptionSchema=new Schema(
    {
    subscriber:{
        type:Schema.types.objectId, //one who is subscribing
        ref:"User"
    },
    chanel:{
         type:Schema.types.objectId, //oneto whom 'subscriber' is subscribing
        ref:"User"
    }
},
{timestamps:true}
)


module.exports=model("Subscription",subscriptionSchema)