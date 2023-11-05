const express = require('express');
const {
  registerController,
  loginController,
  updateAvatarController,
  getUserController,
} = require('../controllers/user');

//Router Object
const router = express.Router();

//Routes
//User Register
router.post('/register', registerController);

//User Login
router.post('/login', loginController);

//User Update Avatar
router.post('/updateAvatar', updateAvatarController);

//User Details
router.get('/:userId', getUserController);

module.exports = router;
