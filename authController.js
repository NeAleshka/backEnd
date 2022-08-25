const User = require('./models/user-model')
const jwt = require('jsonwebtoken')
const UserService = require('./services/user-service')
const mailService = require("./services/mail-service");
const UserDto = require('./dto/user-dto')
const tokenService = require('./services/token-service')

class authController {
    async me(req, res) {
        try {
            const decoded = tokenService.validateAccessToken(req.cookies.accessToken)
            if (!decoded) {
                const {refreshToken} = req.cookies
                const userData = await UserService.refresh(refreshToken)
                res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                res.cookie('accessToken', userData.accessToken, {maxAge: 30 * 60 * 1000, httpOnly: true})
            }
            const user = await User.findById(decoded.userId)
            if (user) {
                return res.status(200).send(
                    {success: true})
            } else {
                return res.status(200).send({success: false, message: "User not authorization"})
            }

        } catch (e) {
            return res.status(400).send({isLogin: false, data: null, message: e.message})
        }
    }

    async getUser(req, res) {
        const decoded = tokenService.validateAccessToken(req.cookies.accessToken)
        if(!decoded){
           throw new Error('Ошибка получения юзера')
        }
        try {
            const user = await User.findById(decoded.userId)
            const userDto = new UserDto(user)
            if (user) {
                return res.status(200).send(
                    {success: true,userData: userDto})
            } else {
                return res.status(400).send({success: false, data: null, message: "User not found!"})
            }
        } catch (e) {
            res.status(400).json({
                message: e.message
            })
        }
    }

    async regisration(req, res) {
        try {
            const {name, lastName, login, password, email, phone, birthday} = req.body
            const userData = await UserService.registrationUser(name, lastName, login, password, email, phone, birthday)
            if(userData){
                if(userData.message){
                    return res.status(200).send({
                        message:userData.message,
                        success: true
                    })
                }
                res.cookie('userId', userData.id.toHexString(),{httpOnly:true})
                return res.status(200).send({
                    success: true
                })
            }
        } catch (e) {
            console.log(e)
            return res.status(400).send({
                message: e.message,
                success: false,

            })
        }
        /*return res.status(400).send({
                    error: {
                        message: "Server Error",
                    },
                    success:false
                })*/
    }

    async login(req, res) {
        try {
            const {password, login} = req.body
            const userData = await UserService.login(login, password)
            res.cookie('accessToken', userData.accessToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).send({
                success: true,
                userData:{
                    accessToken:userData.accessToken,
                    refreshToken:userData.refreshToken
                }
            })
        } catch (e) {
            res.status(200).send({
                success: false,
                error:{
                    message: e.message
                }
            })
        }
    }



    async verification(req, res) {
        try {
            const {verificationCode} = req.body
            const userId= req.headers.cookie.split('=')[1]
            const candidate = await User.findById(userId)
            if (candidate) {
                if (verificationCode === candidate.verificationCode) {
                    const tokens = tokenService.generateToken({userId: candidate._id})
                    await tokenService.saveToken(candidate._id, tokens.refreshToken)
                    res.cookie('refreshToken', tokens.refreshToken.toString(), {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                    res.cookie('accessToken', tokens.accessToken.toString(), {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
                    const userDto = new UserDto(candidate)
                    return res.status(200).send(
                        {success: true}
                    )
                } else return res.status(400).send(
                    {
                        message: 'Введён неверный код',
                        success: false
                    }
                )
            }
        } catch (e) {
            return res.status(400).json({
                message: 'verification Error'
            })
        }
    }

    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.clearCookie('accessToken')
            res.clearCookie('userId')
            return res.json(token)
        } catch (e) {
            return res.status(400).json(e.message)
        }
    }


    async confirmEmail(req, res) {
        try {
            const {email} = req.body
            const userId= req.headers.cookie.split('=')[1]
            const user = await User.findById(userId)
            if (user) {
                await mailService.sendVerificationCode(email, user.verificationCode)
                return res.status(200).send({
                    success: true
                })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send({
                success: false,
                message: 'Код не был отправлен,попробуйте позже'
            })
        }
    }
    async changeUserInfo(req,res){
        const id=req.headers.cookie.split(';')[0].split('=')[1]
        const user= await User.findById(id)
        const userDTO=new UserDto(user)
        return res.status(200).send(userDTO)
    }

}

module.exports = new authController
