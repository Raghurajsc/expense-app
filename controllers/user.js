const User = require('../models/user');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (user) {
            return res.status(403).json({
                message: 'User already exists'
            });
        }

        await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: 'Successfully created user'
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: 'Password is incorrect'
            });
        }

        res.status(200).json({
            message: 'Login successful'
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};