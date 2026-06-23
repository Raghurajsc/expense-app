const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.addExpense = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const { amount, description, category, userId } = req.body;


        const expense = await Expense.create({

            amount,
            description,
            category,
            userId

        }, { transaction: t });


        // update user total expense
        const user = await User.findByPk(userId, {
            transaction: t
        });


        user.totalExpense =
            Number(user.totalExpense) + Number(amount);


        await user.save({
            transaction: t
        });


        await t.commit();


        res.status(201).json(expense);


    } catch(err) {

        await t.rollback();


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

exports.deleteExpense = async (req,res)=>{

    const t = await sequelize.transaction();

    try {

        const expenseId = req.params.expenseId;
        const userId = req.query.userId;


        const expense = await Expense.findOne({

            where:{
                id:expenseId,
                userId:userId
            },

            transaction:t
        });


        await User.update(
            {
                totalExpense:
                sequelize.literal(
                `totalExpense - ${expense.amount}`
                )
            },

            {
                where:{
                    id:userId
                },
                transaction:t
            }
        );


        await expense.destroy({
            transaction:t
        });


        await t.commit();


        res.json({
            message:"Expense deleted"
        });


    }catch(err){

        await t.rollback();

        res.status(500).json({
            error:err.message
        });
    }
}