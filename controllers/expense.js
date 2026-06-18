const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {

    try {
        
        console.log("BODY =", req.body);
        const { amount, description, category,userId } = req.body;

        const expense = await Expense.create({
            amount,
            description,
            category,
            userId
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

        const userId = req.query.userId;

        const expenses = await Expense.findAll({
            where: {
                userId: userId
            }
        });

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

        
         const userId = req.query.userId;
 
        await Expense.destroy({
           where: {
        id: expenseId,
        userId: userId
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