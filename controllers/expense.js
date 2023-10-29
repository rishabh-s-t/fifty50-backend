const Group = require('../models/group');
const User = require('../models/user');
const Expense = require('../models/expense');
const mongoose = require('mongoose');
const { calculateSplit } = require('../services/expenseService');

const addExpenseController = async (req, res) => {
    try {
        const groupId = req.body.group
        const title = req.body.title
        const paidBy = req.body.paidBy
        const description = req.body.description
        const amount = req.body.amount
        const avatar = req.body.avatar
        const members = req.body.members

        if (!avatar) avatar = 1
        if (!description) description = ''

        const group = await Group.findById(groupId)

        if (!group) {
            res.status(404).send('Group not found')
        }

        const memberBalances = await calculateSplit(paidBy, members, amount)

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
            isSettled: false
        })

        await expense.save()
        res.status(200).send({
            message: 'expense added successfully',
            expense: expense,
        })
    } catch (error) {
        res.status(400).send("Ran into an error while contacting the DB")
        return
    }
}

const getGroupMemberExpenseController = async (req, res) => {
    const groupId = req.params.groupId
    const memberId = req.params.memberId

    const expenses = await Expense.find({
        group: groupId,
    }).populate('paidBy', {
        name: 1,
        _id: 1
    })

    const activeExpenses = expenses.filter(expense => {
        return (
            expense.settledMembers.indexOf(memberId) === -1 && !expense.isSettled
        )
    })

    const settledExpenses = expenses.filter(expense => {
        return expense.settledMembers.indexOf(memberId) > -1 || expense.isSettled
    })

    res.send({
        activeExpenses,
        settledExpenses
    })
}

const updateMemberExpense = async (req, res) => {
    const expenseId = req.params.expenseId
    const memberId = req.params.memberId
    const expense = await Expense.findById(expenseId)

    if (!expense) res.status(400).send('Expense not found!')

    const index = expense.settledMembers.indexOf(memberId)

    if (index > -1) res.status(200).send({
        message: 'Member already settled',
        expense: expense,
    })
    else expense.settledMembers.push(memberId)

    if (expense.settledMembers.length === 0) {
        expense.isSettled = false;
    } else {
        const paidByString = expense.paidBy.toString();

        const unSettledMembers = expense.membersBalance.filter(member => member.id.toString() !== paidByString);

        if (expense.settledMembers.length === unSettledMembers.length) {
            expense.isSettled = true;
        }
    }

    await expense.save()
    res.send(expense)
}

module.exports = {
    addExpenseController,
    getGroupMemberExpenseController,
    updateMemberExpense
};
