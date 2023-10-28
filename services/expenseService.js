const User = require('../models/user')

const calculateSplit = async (paidBy, members, amount) => {
    const splitAmount = Number(amount / members.length)
    const memberBalances = await Promise.all(members.map(async member => {
        const user = await User.findById(member)
        const userId = user._id
        const name = user.userName

        if (userId.toString() === paidBy.toString()) {
            return {
                name: name,
                id: userId,
                balance: `${Number(amount - splitAmount).toFixed(2)}`
            }
        } else {
            return {
                name: name,
                id: userId,
                balance: `-${splitAmount.toFixed(2)}`
            }
        }
    }))

    return memberBalances
}

// const updateMemberBalances = async (expenses, members) => {
//     let updateMemberBalances

//     if (expenses) {
//         updatedMemberBalances = expenses.map(({ _id, paidBy, amount }) => {
//             return {
//                 expenseId: _id,
//                 membersBalance: calculateSplit(paidBy, members, amount)
//             }
//         })
//     }

//     return Promise.all(updatedMemberBalances)
// }

module.exports = { calculateSplit }