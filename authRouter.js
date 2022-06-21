const Router=require('express')
const router=new Router()
const controller=require('./authController.js')


router.post('/registration', controller.regisration)
router.post('/login',controller.login)
router.get('/user',controller.getUser)

module.exports= router
