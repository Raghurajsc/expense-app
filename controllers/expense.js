const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {

    try {

        const { amount, description, category } = req.body;

        const expense = await Expense.create({
            amount,
            description,
            category
        });

        res.status(201).json(expense);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.getExpenses = async (req, res) => {

    try {

        const expenses = await Expense.findAll();

        res.status(200).json(expenses);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.deleteExpense = async (req, res) => {

    try {

        const expenseId = req.params.expenseId;

        await Expense.destroy({
            where: {
                id: expenseId
            }
        });

        res.status(200).json({
            message: 'Expense deleted'
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};