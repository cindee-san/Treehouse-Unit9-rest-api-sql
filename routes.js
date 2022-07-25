'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/asyncHandler')
const { User, Courses } = require('./models');

// Construct a router instance.
const router = express.Router();

// Route that returns the current authenticated user.
router.get('/users', asyncHandler(async (req, res) => {
    res.json(req.body).status(200);
  }));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201)
      .json({ "message": "Account successfully created!" })
      .location('/');
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));
  
  // route that returns all courses including the User associated with
  // each course and a 200 HTTP status code.

  router.get('/courses', asyncHandler(async (req, res) => {
      const courses = await Courses.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
      console.log(courses.map(course => course.get({ plain: true})));
  }));

  module.exports = router;
