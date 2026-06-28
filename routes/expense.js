const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
router.post("/ai-analysis", expenseController.aiAnalysis);

router.post('/add-expense', expenseController.addExpense);

router.get('/get-expenses', expenseController.getExpenses);

router.delete(
    '/delete-expense/:expenseId',
    expenseController.deleteExpense
);

module.exports = router;