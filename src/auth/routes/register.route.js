"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");

const { UsersTable } = require("../models/index");

const router = express.Router();

router.post("/register", registerUser);

async function registerUser(req, res) {
  try {
    const record = await UsersTable.create(req.body);
    res.status(201).send(record);
  } catch (error) {
    res.status(403).send("Error Creating User");
  }
}

module.exports = router;
