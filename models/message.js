'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lens: {
          args: [5, 140],
          msg: "Message content must be between 5 to 140 characters"
        }
      }
    },
  }, {
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
      {});
  Message.associate = function(models) {
    Message.belongsTo(models.Contact, {
        as: 'sender',
        foreignKey: 'senderId',
        onDelete: 'CASCADE'
    });

    Message.belongsTo(models.Contact, {
      as: 'receiver',
      foreignKey: 'receiverId',
      onDelete: 'CASCADE'
    });
  };
  return Message;
};