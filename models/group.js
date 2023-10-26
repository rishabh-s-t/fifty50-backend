const mongoose = require('mongoose');
const validator = require('validator');
// Users = {phone, email, name, password, groups, date}
// No uniqueID requried as email is an ID in itself

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Please add group name'],
    trim: true,
  },
  groupDescription: {
    type: String,
    required: false,
  },
  usersInvolved: {
    required: true,
    type: Array,
  },
  owner: {
    type: String,
    required: true,
  },
  groupAvatar: {
    type: Number,
    default: 0,
  },
  inviteID: {
    type: String,
    unique: true,
    required: true,
  },
  bills: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
