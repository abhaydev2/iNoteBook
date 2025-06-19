const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const Note = sequelize.define('Note', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tag: {
        type: DataTypes.STRING,
        defaultValue: "General"
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

// Define the relationship
Note.belongsTo(User);
User.hasMany(Note);

module.exports = Note;