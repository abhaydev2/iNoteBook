const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'inotebook',
    logging: false
});*




const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error.message);
    }
};

module.exports = { sequelize, connectToDatabase };
