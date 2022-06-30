const mongoose=require ('mongoose')

const UserModel=new mongoose.Schema({
    name:{type:String,},
    lastName:{type:String,},
    phone:{type:String,},
    login:{type:String,},
    password:{type:String,},
    birthday:{type:String},
    email:{type:String,},
    verificationCode:{type:Number}
})


module.exports= mongoose.model("User",UserModel)
