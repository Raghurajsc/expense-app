const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./util/database');
const userRoutes = require('./routes/user');

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

app.use('/user', userRoutes);

sequelize.sync()
.then(() => {
    app.listen(3000, () => {
        console.log('Server Running');
    });
})
.catch(err => console.log(err));