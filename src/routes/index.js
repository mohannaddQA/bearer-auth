"use strict";
const express = require("express");
const app = express();
const bearerRouter = express.Router();

const { bearer } = require("../auth/middleware/bearer");
const { handleGetUsers } = require("./handlers/GetUsersHandler.js");
const { handleSecretArea } = require("./handlers/secretAreaHandler.js");
//---------------------------------global middlewares----------------------------------
// app.use(bearer);
//---------------------------------******************----------------------------------

bearerRouter.get("/users", bearer, handleGetUsers);
bearerRouter.get("/secret", bearer, handleSecretArea);

module.exports = bearerRouter;
