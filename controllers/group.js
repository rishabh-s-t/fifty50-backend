const uuid = require('uuid');
const Group = require('../models/group');
const User = require('../models/user');
const mongoose = require('mongoose');

const createGroupController = async (req, res, next) => {
  try {
    // Generating group ID
    let inviteID = uuid.v4().substring(0, 5); //5 characters
    // console.log(inviteID)

    const { groupName, usersInvolved, owner } = req.body;
    //validation
    if (!groupName) {
      return res.status(400).send({
        success: false,
        message: 'name is required',
      });
    }

    let payload = { ...req.body, inviteID };

    // Save Group
    // console.log(req.body);
    // console.log(usersInvolved);
    // console.log(payload)

    Group.create(payload)
      .then((docs) => {
        res.status(201).send({
          success: true,
          message: 'Created Successfully',
          invitation: inviteID,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: false,
          message: 'Error in creating group',
          error: err,
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Error in Register API',
      error: error,
    });
  }
};

const addUserToGroupController = async (req, res, next) => {
  try {
    //Validations
    //check group
    if (!req.body.groupID) {
      let group = await Group.findById(req.body.groupID);
      if (!group) {
        return res.status(404).send({
          success: false,
          message: 'Group not found',
        });
      }
    }

    //check user
    if (!req.body.userID) {
      let user = await User.findById(req.body.userID);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }
    }

    //get group from groupID
    let group = await Group.findById(req.body.groupID);
    console.log(group.usersInvolved);

    let newMembers = [...group.usersInvolved, req.body.userID];

    let updatedGroup = await Group.findByIdAndUpdate(req.body.groupID, {
      usersInvolved: newMembers,
    });

    return res.status(200).send({
      success: true,
      message: 'Updated successfully!',
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'API Error!',
      error: error,
    });
  }
};

module.exports = { createGroupController, addUserToGroupController };
