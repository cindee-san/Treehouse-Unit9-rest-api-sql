'use strict';

const {Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Courses extends Sequelize.Model {}
  Courses.init({
      title: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      estimatedTime: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      materialsNeeded: {
          type: DataTypes.STRING,
          allowNull: false,
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