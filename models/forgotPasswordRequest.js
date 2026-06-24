const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const ForgotPasswordRequest = sequelize.define("forgotPasswordRequest", {

    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },

    isactive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }

});


module.exports = ForgotPasswordRequest;