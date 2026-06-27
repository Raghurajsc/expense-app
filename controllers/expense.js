const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.addExpense = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const { amount, description, note, category, userId } = req.body;


        const expense = await Expense.create({

            amount,
            description,
            category,
            note,
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
        const page = parseInt(req.query.page) || 1;
const ITEMS_PER_PAGE = parseInt(req.query.limit) || 10;

        const totalItems = await Expense.count({
            where: { userId }
        });

        const expenses = await Expense.findAll({
            where: { userId },
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            totalItems
        });

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