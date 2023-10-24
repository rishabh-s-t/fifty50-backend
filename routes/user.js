const express = require('express')
const { registerController, loginController, updateAvatarController } = require('../controllers/user')

//Router Object
const router = express.Router()

//Routes

//User Register
router.post('/register', registerController)

//User Login
router.post('/login', loginController)

//User Update Avatar
router.post('/updateAvatar', updateAvatarController)

module.exports = router