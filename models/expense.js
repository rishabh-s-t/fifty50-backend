const mongoose = require('mongoose');
const validator = require('validator');
// Users = {phone, email, name, password, groups, date}
// No uniqueID requried as email is an ID in itself

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 64,
  },
  avatar: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
    default: 1,
  },
  description: {
    type: String,
    maxlength: 128,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  group: {
    type: mongoose.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  paidBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: {
    type: Array,
    required: true,
    default: [],
  },
  membersBalance: {
    type: Array,
    required: true,
    default: [],
  },
  settledMembers: {
    type: Array,
    default: [],
  },
  isSettled: {
    type: Boolean,
    default: false,
  },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
