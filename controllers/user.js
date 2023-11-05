const User = require('../models/user');
const nodemailer = require('nodemailer'); //importing node mailer
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

//http://------/v1/api/joinMember/------

const registerController = async (req, res, next) => {
  try {
    const {
      userPhoneNumber,
      userName,
      userEmailID,
      password,
      upiID,
      groupsInvolved,
    } = req.body;
    //validation
    if (!userName) {
      return res.status(400).send({
        success: false,
        message: 'name is required',
      });
    }
    if (!userEmailID) {
      return res.status(400).send({
        success: false,
        message: 'email is required',
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: 'password is required and 6 character long',
      });
    }
    //exisiting user
    const exisitingUser = await User.findOne({ userEmailID });
    if (exisitingUser) {
      return res.status(500).send({
        success: false,
        message: 'User Already Register With This EMail',
      });
    }

    //hashed pasword
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    req.body.showAvatar = true;
    //save user
    User.create(req.body)
      .then((docs) => {
        res.status(201).send({
          success: true,
          message: 'Created Successfully',
        });
      })
      .catch((err) =>
        res.status(500).send({
          success: false,
          message: 'Error in Register API',
          err,
        })
      );
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Register API',
      error,
    });
  }
};

const loginController = async (req, res, next) => {
  try {
    //validation
    if (!req.body.userEmailID || !req.body.password) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide Email Or Password',
      });
    }

    // find user
    const user = await User.findOne({ userEmailID: req.body.userEmailID });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: 'User Not Found',
      });
    }

    //match password
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: 'Invalid usrname or password',
      });
    }

    //JWT Token
    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    //removing pw before returning
    req.body.password = undefined;

    res.status(200).send({
      success: true,
      message: 'login successfully',
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Login Route',
      error,
    });
  }
};

const updateAvatarController = async (req, res, next) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ userEmailID: req.body.userEmailID }, req.body, { new: true })

    res.status(200).send({
      message: 'Avatar Updated Successfully',
      user: updatedUser
    })
  } catch (error) {
    res.status(400).send(error)
  }
};

const getUserController = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).send('user doesnt exists');
      return;
    }

    console.log(user.userName);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send('ran into an error');
    console.log(error);
    return;
  }
};

const getMultipleUsersController = async (req, res) => {
  try {
    const userIds = req.body.userIds;
    const users = await User.find({ _id: { $in: userIds } });

    console.log(users)

    if (!users.length) {
      res.status(400).send('users doesnt exists');
      return;
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('ran into an error');
    console.log(error.message);
    return;
  }
}

module.exports = {
  registerController,
  loginController,
  updateAvatarController,
  getUserController,
  getMultipleUsersController
};
