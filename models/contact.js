'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lens: {
          args: [5, 20],
          msg: "Name should be between 5 and 20 characters"
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: {
        msg: "Phone number already exists"
      },
      validate: {
        notEmpty: true
      }
    }
  }, {});
  Contact.associate = function(models) {
    Contact.hasMany(models.Message, {
      foreignKey: 'senderId'
    });

    Contact.hasMany(models.Message, {
      foreignKey: 'receiverId'
    });
  };
  return Contact;
};