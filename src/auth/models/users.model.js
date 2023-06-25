"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const UsersModel = (sequelize, DataTypes) => {
  //this is the best practice so that if we want to do extra stuff on the model and add stuff to it like the methods bellow
  const UsersModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING, //we will not save a bassword in the db  , we will save the hashed version of the encrypted password
        allowNull: false,
      },
      // we will create the user token using getters , and we will expire it also
      token: {
        type: DataTypes.VIRTUAL,
        get() {
          return jwt.sign(
            {
              username: this.username,
            },
            process.env.SECRET,
            { expiresIn: "0.25h" }
          );
        },
      },
      // email: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   unique: true,
      //   validate: {
      //     //this here will validate if the entered is a true email , check validation in sequalize
      //     isEmail: true,
      //   },
      // },
    },
    {
      freezeTableName: true, //some times , sequalise changes the name to plural , this will prevent it
    }
  );

  // this function will get applyed before the creation of the new user coloumn
  // read more about sequalize hooks //
  // in the lab we took another approch ==> do the hashing on the signup
  UsersModel.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return user.password;
  });

  //what we did here is kind of adding a method ==> this not a very accurate explaination ==>{this is allowed because of sequalize ,it will take the created table as an object and ann methodes to it }
  UsersModel.authenticateUser = async function (username, password) {
    // query the database, find if database username === username from request
    let foundUser = await UsersModel.findOne({ where: { username: username } });
    // if a username is found, compare saved password to password from request
    let isAuthenticated = await bcrypt.compare(password, foundUser.password);

    if (isAuthenticated) {
      return foundUser;
    } else {
      throw new Error("Invalid credentials");
    }
  };

  // Bearer AUTH: Validating a token
  UsersModel.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      const user = await this.findOne({ username: parsedToken.username });
      if (user) {
        // if the token is expired, we need to refresh the token
        // not sure how to do that?
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return UsersModel; //we must return model so that the function gets executed and return the value , in previos lab we didn't have to return it becuse we didn't assign the function call to a variable so it automatically returned since it's arrow function
};

module.exports = UsersModel;

// here we defined the function that ==> when executed in the index creates user table in the db
