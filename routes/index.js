'use strict'

const express = require('express');
const router = express.Router();

const { Users, Courses, Sequelize } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// GET Route - Return currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    })
}));

// POST Route - Create a new User
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await Users.create(req.body);
        res.status(201).location('/').end();
    } catch(error) {
        console.error('ERROR: ', error.name);
        // Validation Error
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

// GET Route - Return a list of all courses
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Courses.findAll({
        attributes: [
           'id',
           'title',
           'description',
           'estimatedTime',
           'materialsNeeded'
        ],
        include: [
            {
                model: Users,
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'emailAddress'
                ],
            }
        ]
    });
    res.status(200).json(courses);
}));

// GET Route - Return corresponding course along with the user
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Courses.findByPk(req.params.id, {
        attributes: [
            'id',
            'title',
            'description',
            'estimatedTime',
            'materialsNeeded'
        ],
        include: [
            {
                model: Users,
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'emailAddress'
                ],
            }
        ]
    });
    res.status(200).json(course);
}));

// POST Route - Create a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Courses.create(req.body);
        res.status(201).location('api/courses/' + course.id).end();
    } catch(error) {
        console.error('ERROR: ', error);
        // Validation Error
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

// PUT Route - Update the corresponding course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    try {
        const course = await Courses.findByPk(req.params.id, {
            include: [
                {
                    model: Users
                }
            ]
        });
        // Update only if auth. user === course user
        if (user.emailAddress === course.User.emailAddress) {
            if (course) {
                await course.update(req.body);
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(403);
        }
    } catch(error) {
        console.error('ERROR: ', error);

        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            throw error;
        }
    }
}));

// DELETE Route - Delete the corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Courses.findByPk(req.params.id, {
        include: [
            {
                model: Users
            }
        ]
    });
    // Delete only if auth. user === course user
    if (user.emailAddress === course.User.emailAddress) {
        if (course) {
            await course.destroy();
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(403);
    }
}));

module.exports = router;