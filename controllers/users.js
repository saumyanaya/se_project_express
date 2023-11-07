const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OK } = require("../utils/errors");
const { handleUserHttpError } = require("../utils/errorHandlers");
const { JWT_SECRET } = require("../utils/config");

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
      handleUserHttpError(req, res, err);
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required." });
  }
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    // { name: req.body.name, avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      return res.send({ user });
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
};
