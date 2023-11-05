const express = require('express');
const {
  registerController,
  loginController,
  updateAvatarController,
  getUserController,
  getMultipleUsersController
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

router.post('/getMultipleUsers', getMultipleUsersController)
module.exports = router;
