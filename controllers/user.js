const User = require('../models/user');

exports.signup = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
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