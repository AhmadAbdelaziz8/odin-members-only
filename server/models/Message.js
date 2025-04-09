const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../index');
const User = require('./User');

class Message extends Model {}

Message.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
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
  sequelize,
  modelName: 'Message',
  timestamps: true // This will add createdAt and updatedAt fields
});

// Define the relationship between Message and User
Message.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

User.hasMany(Message, {
  foreignKey: 'userId',
  as: 'messages'
});

module.exports = Message;