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

function getUser(req, res) {
  User.findById(req.params._id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

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

// const loginUser = (req, res) => {
//   const { email, password } = req.body;
//   User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign(
//         { _id: user._id },
//         JWT_SECRET,
//         { expiresIn: "7d" }, // this token will expire an hour after creation
//       );
//       res.send({ token });
//       if (!user) {
//         return Promise.reject(new Error("Incorrect email or password"));
//       }

//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       if (!matched) {
//         // the hashes didn't match, rejecting the promise
//         return Promise.reject(new Error("Incorrect email or password"));
//       }

//       // authentication successful
//       res.send({ message: "Everything good!" });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(UNAUTHORIZED).send({ message: err.message });
//     });
// };

//updateUser

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      handleUserHttpError(req, res, err);
    });
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
};
