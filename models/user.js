const mongoose = require('mongoose');
const validator = require('validator');
// Users = {phone, email, name, password, groups, date}
// No uniqueID requried as email is an ID in itself

const UserSchema = new mongoose.Schema({
  userPhoneNumber: {
    type: Number,
    required: [true, 'Please add your phone number'],
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  userEmailID: {
    type: String,
    required: [true, 'Please add email ID'],
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error('Email ID invalid');
      }
    },
  },
  userName: {
    type: String,
    required: [true, 'Please add name'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  upiID: {
    type: String,
  },
  groupsInvolved: {
    type: [mongoose.Types.ObjectId],
  },
  userAvatar: {
    type: Number,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
