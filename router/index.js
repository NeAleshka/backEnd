const Router=require('express')
const router=new Router()
const controller=require('../authController.js')
const authMiddleware=require('../middlewares/auth-middleware')

router.post('/registration', controller.regisration)
router.get('/authMe', controller.me)
router.post('/login',controller.login)
router.post('/logout',controller.logout)
router.post('/user/info',controller.getUser)
router.post('/verification',controller.verification)
router.get('/refreshToken',controller.refreshToken)
router.post('/confirm_email',controller.confirmEmail)

module.exports= router
