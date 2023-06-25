"use strict";

const { UsersTable } = require("../models/index");

const bearer = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    return UsersTable.authenticateToken(token)
      .then((user) => {
        req.user = user;

        next();
      })
      .catch((error) => {
        res.status(403).send("Invalid Login");
        // next(`Unauthorized access: ${error}`);
      });
  } catch (error) {
    res.status(403).send("Invalid Login");
  }
};

module.exports = { bearer };
