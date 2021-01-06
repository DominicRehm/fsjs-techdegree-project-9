'use strict'
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = (sequelize) => {
    class Courses extends Model {}
    Courses.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter a title for your new course!'
                },
                notEmpty: {
                    msg: 'Please enter a title for your new course!'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter a description for your new course!'
                },
                notEmpty: {
                    msg: 'Please enter a description for your new course!'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
        },
        materialsNeeded: {
            type: DataTypes.STRING,
        }
    }, { sequelize });

    Courses.associate = (models) => {
        Courses.belongsTo(models.Users, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: true,
            }
        })
    }

    return Courses;
}