const mongoose=require ('mongoose')


const User=new mongoose.Schema({
    name:{type:String,},
    lastName:{type:String,},
    phone:{type:String},
    login:{type:String,},
    password:{type:String},
    birthday:{type:String},
    email:{type:String}
})


module.exports= mongoose.model("User",User)
