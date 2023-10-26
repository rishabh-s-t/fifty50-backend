const uuid = require('uuid');
const Group = require('../models/group');
const User = require('../models/user');
const mongoose = require('mongoose');

const createGroupController = async (req, res) => {
  const inviteId = uuid.v4().substring(0, 5);
  const { groupName, usersInvolved, owner } = req.body;

  if (!groupName) {
    return res.status(400).send({
      success: false,
      message: 'Group name is required',
    });
  }

  const invite = { inviteID: inviteId };

  let payload = { ...req.body, ...invite };

  Group.create(payload)
    .then((group) => {
      User.findByIdAndUpdate(owner, { $push: { groupsInvolved: group._id } })
        .then(() => {
          res.status(201).send({
            success: true,
            message: 'Created Successfully',
            invitation: inviteId,
          });
        })
        .catch((err) => {
          res.status(500).send({
            success: false,
            message: 'Error occured while creating the group',
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        success: false,
        message: 'Error occured while communicating with the DB',
        error: err,
      });
    });
};

const addUserToGroupController = async (req, res) => {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;
  const group = await Group.findOne({ inviteID: groupId });

  if (!group) {
    res.status(404).send('Group not found');
    return;
  }

  const member = await User.findById(memberId);
  if (!member) {
    res.status(404).send('User not found');
    return;
  }

  if (group.usersInvolved.includes(member._id)) {
    res.status(400).send('User already exists in the group');
    return;
  }

  group.usersInvolved.push(memberId);
  await group.save();

  res.status(200).send('User added successfully');
};

const getGroupController = async (req, res) => {
  const groupId = req.params.groupId;
  const group = Group.findOne({ inviteID: groupId });

  if (!group) {
    res.status(404).send('No group with the following Id');
    return;
  }

  res.status(200).send({
    //todo
  });
};

module.exports = { createGroupController, addUserToGroupController };
