require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');


const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const premiumRoutes = require("./routes/premium");
const passwordRoute = require("./routes/password");


const User = require("./models/user");
const Expense = require('./models/expense');
const Payment = require('./models/payment');
const ForgotPasswordRequest = require("./models/forgotPasswordRequest");


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));


// static files
app.use(express.static(path.join(__dirname, 'public')));


// pages

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'expense.html'));
});



// payment success

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




// routes

app.use("/premium", premiumRoutes);

app.use('/user', userRoutes);

app.use('/expense', expenseRoutes);

app.use('/payment', paymentRoutes);

app.use("/password", passwordRoute);





// relationships


User.hasMany(Expense);

Expense.belongsTo(User);



User.hasMany(Payment);

Payment.belongsTo(User);



// Forgot password relationship

User.hasMany(ForgotPasswordRequest, {
    foreignKey:"userId"
});


ForgotPasswordRequest.belongsTo(User, {
    foreignKey:"userId"
});




// database sync

sequelize.sync()
.then(() => {

    app.listen(3000, () => {

        console.log('Server Running');

    });

})
.catch(err => console.log(err));