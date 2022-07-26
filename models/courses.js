'use strict';

const {Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Courses extends Sequelize.Model {}
  Courses.init({
      title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'A title is required',
            },
            notEmpty: {
              msg: 'Please provide a title for your course',
            },
          },
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'A description is required',
            },
            notEmpty: {
              msg: 'Please provide a description for your course',
            },
          },
      },
      estimatedTime: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      materialsNeeded: {
          type: DataTypes.STRING,
          allowNull: true,
      },
    }, { sequelize });

    Courses.associate= (models) => {
        Courses.belongsTo(models.User, { 
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Courses;
};