const mongoose = require('mongoose');
const validator = require('validator');
// Users = {phone, email, name, password, groups, date}
// No uniqueID requried as email is an ID in itself

const ExpenseSchema = new mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  group: {
    type: String,
    ref: 'Group',
    required: true,
  },
  paidBy: {
    type: String,
    ref: 'User',
    required: true,
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
