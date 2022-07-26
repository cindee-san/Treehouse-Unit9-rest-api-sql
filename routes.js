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
        attributes: [
          'userId',
        ]
      });
      console.log(courses.map(course => course.get()));
      res.json(courses).status(200);
  }));

  // route that will return the corresponding course 
  // including the User associated with that course 
  // and a 200 HTTP status code.
  router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Courses.findByPk(req.params.id);
    if(course) {
      res.json(course).status(200);
    } else {
      res.status(404);
    }
  }));

  // POST route that will create a new course, 
  // set the Location header to the URI for the newly created course, 
  // and return a 201 HTTP status code and no content.
  router.post('/courses', asyncHandler(async (req,res) => {
    let course;
   try { 
     course = await Courses.create(req.body);
    res
    .location(`/courses/${course.id}`)
    .status(201).end();
  } catch (error){
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
  }));

 // PUT route that will update the corresponding course 
 // and return a 204 HTTP status code and no content.
  router.put('/courses/:id', asyncHandler(async (req,res) => {
    let course;
    try{
      course = await Courses.findByPk(req.params.id);
      if(course) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(404);
      }
    } catch(error){
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

 // DELETE route that will delete the corresponding course 
 // and return a 204 HTTP status code and no content.
 router.delete('/courses/:id', asyncHandler(async (req,res) => {
   const course = await Courses.findByPk(req.params.id);
   await course.destroy();
   res
   .status(204).end();
}));


  module.exports = router;
