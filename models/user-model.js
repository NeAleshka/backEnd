const mongoose=require ('mongoose')

const UserModel=new mongoose.Schema({
    name:{type:String,},
    lastName:{type:String,},
    phone:{type:String,},
    login:{type:String,},
    password:{type:String,},
    birthday:{type:String},
    email:{type:String,},
    verificationCode:{type:Number},
    bonuses:{
        bonus:{type:Number},
        points:{type:Number},
        check:{type:Number},
        sum:{type:Number},
    },
    cardNumber:{type:String},
    organizationInfo:{
        name:{type:String},
        logo:{type:String}
    }
})


module.exports= mongoose.model("User",UserModel)
