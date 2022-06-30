const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        return await tokenModel.create({user: userId, refreshToken})
    }

    async removeToken(refreshToken) {
        const tokenData = tokenModel.deleteOne({refreshToken});
        return tokenData
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = tokenModel.findOne({refreshToken});
        return tokenData
    }

    parseAuthHeader(authHeader) {
        const tokens = authHeader.split(' ')
        if(tokens.length !== 2) {
           throw new Error('Invalid Auth header!')
        } else if(tokens[0] !== 'Bearer') {
            throw new Error('Must starts with Bearer')
        }
        return tokens[1]
    }
}

module.exports = new TokenService()
