const uuid = require('uuid');
const Group = require('../models/group');
const User = require('../models/user');
const mongoose = require('mongoose');

const createGroupController = async (req, res) => {
  const inviteId = uuid.v4().substring(0, 5);
  const { groupName, usersInvolved, owner, groupDescription } = req.body;

  if (!groupName) {
    return res.status(400).send({
      success: false,
      message: 'Group name is required',
    });
  }

  if (groupDescription.length > 64) {
    return res.status(400).send({
      success: false,
      message: 'Group description too long',
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

  const member = await User.findById({ _id: memberId });
  if (!member) {
    res.status(404).send('User not found');
    return;
  }

  if (group.usersInvolved.includes(member._id)) {
    res.status(400).send('User already exists in the group');
    return;
  }

  group.usersInvolved.push(member._id);
  await group.save();

  //modify the user's groups involved array
  const grpId = group._id;
  console.log(grpId);
  member.groupsInvolved.push(group._id);
  await member.save();

  res.status(200).send('User added successfully');
};

const getGroupFromInviteController = async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findOne({ inviteID: groupId }).exec();

  if (!group) {
    res.status(404).send('No group with the following Id');
    return;
  }

  res.status(200).send({
    name: group.groupName,
    description: group.groupDescription,
    members: group.usersInvolved,
    owner: group.owner,
    avatar: group.groupAvatar,
    date: group.createdDate,
    bills: group.bills,
    id: group._id,
  });
};

const deleteGroupController = async (req, res) => {
  const groupId = req.params.groupId;
  const group = await Group.findById(groupId);

  if (!group) {
    res.status(404).send('Group not found');
  }

  //Todo Delete expense

  const result = await Group.deleteOne({ _id: groupId });

  return res.status(200).send('Group Deleted');
};

const getAllGroupsFromMemberId = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const groups = await Group.find({ usersInvolved: memberId }).lean();
    res.status(200).send({
      groups: groups,
      length: groups.length,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error in fetching the user groups',
      error: error.message,
    });
  }
};

const getGroupsFromIdController = async (req, res) => {
  let groupIds = req.query.groupIds;

  if (!groupIds || groupIds.length === 0) {
    res.status(400).send({
      message: 'no groups in request or invalid format',
    });
    return;
  }

  groupIds = groupIds.split(',');

  const mongoIds = groupIds.map((id) => {
    return new mongoose.Types.ObjectId(id);
  });

  const groupDetails = [];

  try {
    for (const id of mongoIds) {
      const group = await Group.findById(id);
      groupDetails.push(group);
    }
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
    return;
  }

  res.status(200).send({
    groups: groupDetails,
  });
};

const getExpenseController = async (req, res) => {};

module.exports = {
  createGroupController,
  addUserToGroupController,
  getGroupFromInviteController,
  deleteGroupController,
  getAllGroupsFromMemberId,
  getExpenseController,
  getGroupsFromIdController,
};
