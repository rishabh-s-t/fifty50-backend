const mongoose = require('mongoose');
const validator = require('validator');
// Users = {phone, email, name, password, groups, date}
// No uniqueID requried as email is an ID in itself

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Please add group name'],
    trim: true,
    minlength: 1,
    maxlength: 50,
  },
  groupDescription: {
    type: String,
    maxlength: 64,
  },
  usersInvolved: {
    type: [mongoose.Types.ObjectId],
    required: true,
    ref: 'User',
  },
  owner: {
    type: mongoose.Types.ObjectId,
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
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
