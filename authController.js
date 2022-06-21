const User =require ('./models/User.js')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {secret}=require('./config.js')

const generateAccessToken=(id)=>{
    const payload={id}
    return jwt.sign(payload,secret,{expiresIn: '10h'})
}

class authController {
    async regisration(req, res) {
        try {
            const {name, lastName,login, password, email, phone,birthday} = req.body

            const candidate = await User.findOne({phone})
            if (candidate) {
                return res.status(400).json('Такой пользователь уже существует')
            } else {
                const hashPassword=bcrypt.hashSync(password.toString(),2)
                const newUser=await User.create({name, lastName, password:hashPassword, email, phone,login,birthday})
               await newUser.save()
                res.sendStatus(200).json({message:"Пользователь зарегистрирован"})
                return res.json({message:"Пользователь зарегистрирован"})
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    static async login(req, res) {
        try {
           const {password,login}=req.body
            const loginUser=await User.findOne({login})
            if(!loginUser){
                return res.status(400).json({message: `Пользователь не найден`})
            }
            const validPassword=bcrypt.compareSync(password,loginUser.password)
            if(!validPassword){
                return res.status(400).json({message: `Введён неверный пароль`})
            }
                const token=generateAccessToken(loginUser._id)
                return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'login error'})
        }
    }

    static async getUser(req, res) {
        try {
            const {name}=req.body
            const user=await User.find({name})
            res.json(user)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports=authController
