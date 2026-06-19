const User = require("../models/user");
const Expense = require("../models/expense");

const Sequelize = require("sequelize");

exports.showLeaderboard = async (req, res) => {

    try {

        const leaderboard = await User.findAll({

            attributes: [

                "id",

                "name",

                [
                    Sequelize.fn(
                        "SUM",
                        Sequelize.col("expenses.amount")
                    ),
                    "totalExpense"
                ]

            ],

            include: [

                {
                    model: Expense,
                    attributes: []
                }

            ],

            group: ["user.id"],

            order: [
                [
                    Sequelize.literal("totalExpense"),
                    "DESC"
                ]
            ]

        });

        res.status(200).json(leaderboard);

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};