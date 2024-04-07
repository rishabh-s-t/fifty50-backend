const Group = require('../models/group');
const User = require('../models/user');
const Expense = require('../models/expense');
const mongoose = require('mongoose');
const { calculateSplit } = require('../services/expenseService');

const addExpenseController = async (req, res) => {
  try {
    let groupId = req.body.group;
    let title = req.body.title;
    let paidBy = req.body.paidBy;
    let description = req.body.description;
    let amount = +req.body.amount;
    let avatar = req.body.avatar;
    let members = req.body.members;

    if (!avatar) avatar = 1;
    if (!description) description = '';

    let group = await Group.findById(groupId);

    if (!group) {
      res.status(404).send('Group not found');
    }

    let memberBalances = await calculateSplit(paidBy, members, amount);

    const expense = new Expense({
      title: title,
      avatar: avatar,
      description: description,
      amount: amount,
      date: Date.now(),
      group: groupId,
      paidBy: paidBy,
      members: members,
      membersBalance: memberBalances,
      settledMembers: [paidBy],
      isSettled: false,
    });

    await expense.save();
    res.status(200).send({
      message: 'expense added successfully',
      expense: expense,
    });
  } catch (error) {
    res.status(400).send({
      message: 'Ran into an error while contacting DB',
      error: error.message,
    });
    return;
  }
};

const getGroupMemberExpenseController = async (req, res) => {
  const groupId = req.params.groupId;
  const memberId = req.params.memberId;

  const expenses = await Expense.find({
    group: groupId,
  }).populate('paidBy', {
    name: 1,
    _id: 1,
  });

  const activeExpenses = expenses.filter((expense) => {
    return (
      expense.settledMembers.indexOf(memberId) === -1 && !expense.isSettled
    );
  });

  const settledExpenses = expenses.filter((expense) => {
    return expense.settledMembers.indexOf(memberId) > -1 || expense.isSettled;
  });

  res.send({
    activeExpenses,
    settledExpenses,
  });
};

const deleteMemberExpense = async (req, res) => {
  const expenseId = req.params.expenseId;
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    return res.status(400).send('Expense not found!');
  }

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId });

    if (deletedExpense) {
      res.status(200).send({
        data: deletedExpense,
      });
    } else {
      res.status(500).send({
        message: 'Expense not found!',
      });
    }
  } catch (error) {
    console.log('Error deleting expense ', error);
  }
};

const updateMemberExpense = async (req, res) => {
  const expenseId = req.params.expenseId;
  const memberId = req.params.memberId;
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    return res.status(400).send('Expense not found!');
  }

  const index = expense.settledMembers.indexOf(memberId);

  if (index > -1) {
    return res.status(200).send({
      message: 'Member already settled',
      expense: expense,
    });
  } else {
    expense.settledMembers.push(memberId);

    const updatedMemberBalances = [...expense.membersBalance];

    const memberIndex = updatedMemberBalances.findIndex(
      (member) => member.id == memberId
    );
    if (memberIndex !== -1) {
      updatedMemberBalances[memberIndex].balance = `${Math.abs(
        updatedMemberBalances[memberIndex].balance
      )}`;
    }

    try {
      await Expense.findOneAndUpdate(
        { _id: expenseId },
        { $set: { membersBalance: updatedMemberBalances } },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating membersBalance:', error);
      return res.status(500).send('Error updating membersBalance');
    }
  }

  if (expense.members.length == expense.settledMembers.length) {
    expense.isSettled = true;
  } else {
    expense.isSettled = false;
  }

  await expense.save();
  res.send(expense);
};

module.exports = {
  addExpenseController,
  getGroupMemberExpenseController,
  updateMemberExpense,
  deleteMemberExpense,
};
