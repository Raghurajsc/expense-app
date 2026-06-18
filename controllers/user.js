const User = require('../models/user');
const bcrypt=require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        }); 

        console.log("LOGIN USER:", user.email);
console.log("DB PASSWORD:", user.password);

        if (user) {
            return res.status(403).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password:hashedPassword
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

         const isMatch = await bcrypt.compare(
            password,
            user.password
         );

         console.log("MATCH:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
           message: 'User not authorized'
        });
    }

        res.status(200).json({
            message: 'Login successful',
             userId: user.id
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};