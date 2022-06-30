const User = require('./models/user-model')
const jwt = require('jsonwebtoken')
const UserService = require('./services/user-service')
const mailService = require("./services/mail-service");
const UserDto = require('./dto/user-dto')
const tokenService=require('./services/token-service')

class authController {
    async me(req, res) {
        try {
            const token = tokenService.parseAuthHeader(req.headers.authorization)
            const decoded = tokenService.validateAccessToken(token)
            if(!decoded) {
                return res.status(401).send({
                    isLogin:false,
                    message: 'User not found!'
                })
            }
            const user =await User.findById(decoded.userId)
            const userDto=new UserDto(user)
            if(user) {
                return res.status(200).send(
                    { isLogin: true, userData: userDto})
            } else {
                return res.status(200).send({isLogin: false, data: null, message:"User not found!"})
            }

        } catch (e) {
            return res.status(200).send({ isLogin: false, data: null, message: e.message })
        }
    }

    async regisration(req, res) {
        try {
            const {name, lastName, login, password, email, phone, birthday} = req.body
            const userData = await UserService.registrationUser(name, lastName, login, password, email, phone, birthday)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.cookie('accessToken', userData.accessToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).send({
                userData,
                isLogin: true
            })
        } catch (e) {
            console.log(e)
            return res.status(400).send({
                data: {
                    message: e.message,
                    isLogin: false,
                },
            })
        }
    }

    async login(req, res) {
        try {
            const {password, login} = req.body
            const userData = await UserService.login(login, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).send({
                userData: userData,
                isLogin: true
            })
        } catch (e) {
            console.log(e)
            res.status(400).send({
                isVerification: false,
                message: e.message
            })
        }
    }

    async getUser(req, res) {
        try {
            const {login} = req.body
            const user = await User.findOne({login})
            const userDto = new UserDto(user)
            res.status(200).send(userDto)
        } catch (e) {
            res.status(400).json({
                message: 'Ошибка получения данных'
            })
        }
    }

    async verification(req, res) {
        try {
            const {verificationCode, login} = req.body
            const candidate = await User.findOne({login})
            if (candidate) {
                if (verificationCode === candidate.verificationCode) {
                    const userDto=new UserDto(candidate)
                    return res.status(200).send(
                        {
                            message: 'Верификация пройдена',
                            isVerification: true,
                            userData: userDto
                        }
                    )
                } else return res.status(400).send(
                    {
                        message: 'Введён неверный код',
                        isVerification: false
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
            const {refreshToken}=req.cookies
            const token=await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200)
        } catch (e) {
          return res.status(400).json(e.message)
        }
    }

    async refreshToken(req, res) {
        try {
           const {refreshToken}=req.cookies
            const userData=await UserService.refresh(refreshToken)
            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json('RefreshToken ok')
        } catch (e) {
            console.log(e.message);
            return res.status(400).json(e.message)
        }
    }

    async confirmEmail(req, res) {
        try {
            const {email, login} = req.body
            const user = await User.findOne({login})
            if (user) {
                await mailService.sendVerificationCode(email, user.verificationCode)
                return res.status(200).send({
                    isVerification: true
                })
            }
        } catch (e) {
            console.log(e)
            res.status(400).send({
                isVerification: false,
                message: 'Пользователь с таким логином не найден'
            })
        }
    }

}

module.exports = new authController
