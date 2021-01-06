'use strict'
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class Users extends Model {}
    Users.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Your first name ist required!'
                },
                notEmpty: {
                    msg: 'Please provide your first name!'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Your last name is required!'
                },
                notEmpty: {
                    msg: 'Please provide your last name!'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists!'
            },  
            validate: {
                notNull: {
                    msg: 'Your email address is required!'
                },
                isEmail: {
                    msg: 'Please provide a valid email address'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            },  
            validate: {
                notNull: {
                    msg: 'Your password is required!'
                },
                notEmpty: {
                    msg: 'Please provide a password!'
                }
            }
        }
    }, { sequelize });

    Users.associate = (models) => {
        Users.hasMany(models.Courses, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: true,
            }
        })
    }

    return Users;
}