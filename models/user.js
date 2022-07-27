'use strict';

const {Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required',
        },
        notEmpty: {
          msg: 'Please provide a first name',
        },
      },
    },
    lastName:  {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A last name is required',
          },
          notEmpty: {
            msg: 'Please provide a last name',
          },
        },
      },
      emailAddress:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'The email you entered already exists'
        },
        validate: {
          notNull: {
            msg: 'An email is required',
          },
          isEmail: {
            msg: 'Please provide a valid email address',
          },
        },
      },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        if(val){
          this.setDataValue('password', hashedPassword);
        };
      },
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Courses, { 
        foreignKey: {
            fieldName: 'userId',
            allowNull: false,
        },
    });
  };

  return User;
};
