const User = require("../models/user");
const { OK } = require("../utils/errors");
const { handleUserHttpError } = require("../utils/errorHandlers");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        res.status(OK).send({ userData });
      })
      .catch((err) => {
        console.error(err);
        handleUserHttpError(req, res, err);
      }),
  );
};

const getUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.error(err);
      handleUserHttpError(req, res, err);
    });
};

//LoginUser
const loginUser = (req, res) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      handleUserHttpError(req, res, err);
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Requested Resource Not Found" });
      }
      return res.send({ user });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        res.status(400).send({ message: "Incorrect email or password" });
      } else {
        handleUserHttpError(req, res, err);
      }
    });
};
module.exports = {
  createUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
};
