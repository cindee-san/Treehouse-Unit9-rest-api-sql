"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.authenticateUser = async (req, res, next) => {
  let message; // store the message to display

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  console.log(credentials);

  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name },
    });

    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(`Authentication successful for user: ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        message = `Authentication failure for user: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for user: ${credentials.emailAddress}`;
    }
  } else {
    message = "Auth header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};
