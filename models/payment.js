const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const Payment = sequelize.define('payment', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },


    orderId: {
        type: Sequelize.STRING,
        allowNull: false
    },


    paymentSessionId: {
        type: Sequelize.STRING,
        allowNull: false
    },


    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },


    status: {
        type: Sequelize.STRING,
        defaultValue: "PENDING"
    },

    userId:{
    type: Sequelize.INTEGER,
    allowNull:false
}

});


module.exports = Payment;