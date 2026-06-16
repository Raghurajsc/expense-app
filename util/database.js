const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'expenses_app',
    'root',
    'Raghuraj@1',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;