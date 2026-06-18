const express = require('express');
const cors = require('cors');
const path = require('path');


const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();

app.use(cors());
app.use(express.json());

// Serve JS files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Expense page
app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);

const User=require('./models/user');
const Expense = require('./models/expense');

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(3000, () => {
        console.log('Server Running');
    });
})
.catch(err => console.log(err));