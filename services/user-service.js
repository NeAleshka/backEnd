const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const tokenService = require('../services/token-service')
const UserDto = require('../dto/user-dto')
const ApiError=require('../exception/api-error')


class UserService {
    async registrationUser(name, lastName, login, password, email, phone, birthday) {
        const userPhone=phone
        const userEmail=email
        const candidate = await User.findOne({login})
        if (candidate) {
            throw new Error('Пользователь уже существует')
        } else {
            const hashPassword = bcrypt.hashSync(password.toString(), 2)
            const confirmCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const newUser = await User.create({
                name,
                lastName,
                password: hashPassword,
                email:userEmail,
                phone:userPhone,
                login,
                birthday,
                verificationCode: confirmCode
            })
            const userDto = new UserDto({name, lastName, phone, email})
            const tokens = tokenService.generateToken({userId: newUser._id})
            await tokenService.saveToken(newUser._id, tokens.refreshToken)
            return { ...tokens, user:userDto}
        }
    }

    async login(login,password){
        const loginUser= await User.findOne({login})
        if(!loginUser){
            throw new Error('Пользователь не найден')
        }
        const validPassword=await bcrypt.compare(password,loginUser.password)
        if(!validPassword){
            throw new Error('Введён неверный пароль')
        }
        const userDto=new UserDto(loginUser)
        const tokens=tokenService.generateToken({userId: loginUser._id})
        await tokenService.saveToken(loginUser._id,tokens.refreshToken)
        return{...tokens,user:userDto}
    }

    async logout(refreshToken){
        return await tokenService.removeToken(refreshToken)
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData=tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB=await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }
        const user=await User.findById(userData._id)
        const userDto=new UserDto(user)
        const tokens=tokenService.generateToken({...userDto})
        await tokenService.saveToken(userData._id,tokens.refreshToken)
        return{...tokens,user:userDto}
    }
}


module.exports = new UserService()
