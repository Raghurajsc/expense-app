require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');


const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const premiumRoutes =
require("./routes/premium");


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


app.get('/payment-success',(req,res)=>{


    const orderId = req.query.order_id;


    res.send(`

        <h1>Payment Processing...</h1>


        <script>

        fetch("/payment/verify/${orderId}")
        .then(res=>res.json())
        .then(data=>{

            if(data.success){

                alert("Transaction successful");

            }
            else{

                alert("TRANSACTION FAILED");

            }

            window.location.href="/expense";

        })


        </script>

    `);


});
app.use("/premium",premiumRoutes);
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/payment', paymentRoutes);


const User=require('./models/user');
const Expense = require('./models/expense');
const Payment = require('./models/payment');

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(3000, () => {
        console.log('Server Running');
    });
})
.catch(err => console.log(err));