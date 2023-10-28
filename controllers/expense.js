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
            settledMembers: [],
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

module.exports = {
    addExpenseController
};
