"use strict";

const express = require("express");
const auth = require("basic-auth");
const { authenticateUser } = require("./middleware/auth-user");
const { asyncHandler } = require("./middleware/asyncHandler");
const { User, Courses } = require("./models");

// Construct a router instance.
const router = express.Router();

// Route that returns the current authenticated user.
// filters the data values of the current user
// to return firstName, lastName and emailAddress
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const userInfo = user.dataValues;
    const userInfoShared = Object.keys(userInfo)
      .slice(1, 4)
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: user[key],
        });
      }, {});

    res.json(userInfoShared).status(200);
  })
);

// Route that creates a new user.
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    let user;
    try {
      user = await User.create(req.body);
      const errors = [];
      // validate that there is a firstName value
      if (!user.firstName) {
        errors.push("Please provide a value for firstName");
      }
      // validate that there is a lastName value
      if (!user.lastName) {
        errors.push("Please provide a value for lastName");
      }
      // validate that there is a value for email
      if (!user.email) {
        errors.push("Please provide a value for email");
      }
      // validate that there is a value for password
      if (!user.password) {
        errors.push("Please provide a value for password");
      }
      res.location("/").status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// route that returns all courses including the User associated with
// each course and a 200 HTTP status code.

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Courses.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId']
      },
      include:[{
        model: User,
        attributes: {
          exclude:['createdAt', 'updatedAt', 'password']
        }
      }]
    });
    console.log(courses.map((course) => course.get()));
    res.json(courses).status(200);
  })
);

// route that will return the corresponding course
// including the User associated with that course
// and a 200 HTTP status code.
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Courses.findByPk(req.params.id, {
      include:[{
        model: User,
        attributes: {
          exclude:['createdAt', 'updatedAt', 'password']
        }
      }]
    });
    if (course) {
      const courseInfo = course.dataValues;
      // takes the course information and turns it into an array
      const neededInfo = Object.entries(courseInfo);
      // cuts "createdAt and updatedAt and 'userId' out of the array"
      neededInfo.splice(5, 3);
      // turns the array back into an object with key:value pairs
      const displayCourseInfo = Object.fromEntries(neededInfo);

      res.json(displayCourseInfo).status(200);
    } else {
      res.status(404);
    }
  })
);

// POST route that will create a new course,
// set the Location header to the URI for the newly created course,
// and return a 201 HTTP status code and no content.
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course;
    try {
      course = await Courses.create(req.body);
      let errors = [];
      // validate that there is a title value
      if (!course.title) {
        errors.push("Please provide a value for title");
      }
      if (!course.description) {
        errors.push("Please provide a value for description");
      }
      res.location(`/courses/${course.id}`).status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// PUT route that will update the corresponding course
// and return a 204 HTTP status code and no content.
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    let course;
    try {
      course = await Courses.findByPk(req.params.id);
      // conditional to match user ID if user with courseID of course
      // to authenticate if the user has authorization to perform update
      if (user.id === course.dataValues.userId) {
        if (course) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(404);
        }
      } else {
        res.status(403).end();
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// DELETE route that will delete the corresponding course
// and return a 204 HTTP status code and no content.
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    const course = await Courses.findByPk(req.params.id);
    // conditional to match user ID if user with courseID of course
    // to authenticate if the user has authorization to perform delete
    if (user.id === course.dataValues.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).end();
    }
  })
);

module.exports = router;
