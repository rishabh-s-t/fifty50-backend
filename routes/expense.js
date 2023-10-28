const express = require('express');
const {
    addExpenseController
} = require('../controllers/expense');

//Router Object
const router = express.Router();

//add expense
router.post("/", addExpenseController)

module.exports = router;