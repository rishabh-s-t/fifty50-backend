const express = require('express');
const {
  addExpenseController,
  getGroupMemberExpenseController,
  updateMemberExpense,
  deleteMemberExpense,
} = require('../controllers/expense');

//Router Object
const router = express.Router();

//add expense
router.post('/', addExpenseController);
router.get('/group/:groupId/member/:memberId', getGroupMemberExpenseController);
router.post('/:expenseId/settle/:memberId', updateMemberExpense);
router.delete('/:expenseId', deleteMemberExpense);

module.exports = router;
