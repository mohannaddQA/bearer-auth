"use strict";

const express = require("express");
const basicAuth = require("../middleware/basic");

const router = express.Router();

router.post("/sign-in", basicAuth, async (req, res) => {
  try {
    res.status(200).send({
      username: req.user.username,
      token: req.user.token,
      id: req.user.id,
    });
  } catch (error) {
    res.status(404).send("Invalid Login");
  }
});

module.exports = router;
