const User = require("../models/user");
const { OK, UNAUTHORIZED, BAD_REQUEST } = require("../utils/errors");
const { handleUserHttpError } = require("../utils/errorHandlers");
const { JWT_SECRET } = require("../utils/config");
const bcrypt = require("bcryptjs"); // importing bcrypt
const jwt = require("jsonwebtoken");

// module.exports.createUser = (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   if (!email || !password) {
//     return res.status(BAD_REQUEST).send({ message: "No user found" });
//   }
//   return User.findOne({ email }).then((userFound) => {
//     if (userFound) {
//       return res
//         .status(DUPLICATES)
//         .send({ message: "That email already exists" });
//     }

//     return bcrypt
//       .hash(password, 10)
//       .then((hash) => {
//         User.create({ name, avatar, email, password: hash })
//           .then((user) =>
//             res.send({
//               name,
//               avatar,
//               email,
//               _id: user._id,
//             }),
//           )
//           .catch((err) => {
//             console.error(err);
//             handleUserHttpError(req, res, err);
//           });
//       })
//       .catch((err) => {
//         console.error(err);
//         handleUserHttpError(req, res, err);
//       });
//   });
// };

exports.createUser = (req, res) => {
  // hashing the password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email: req.body.email,
        password: hash, // adding the hash to the database
      }),
    )
    .then((user) => res.send(user))
    .catch((err) => res.status(BAD_REQUEST).send(err));
};

function getUsers(req, res) {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch((err) => {
      handleUserHttpError(req, res, err);
    });
}

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

// LoginUser

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        "JWT_SECRET",
        { expiresIn: "7d" }, // this token will expire an hour after creation
      );
      res.send({ token });
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // the hashes didn't match, rejecting the promise
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // authentication successful
      res.send({ message: "Everything good!" });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

//updateUser

module.exports.updateUser = (req, res) => {
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
  getUsers,
  getUser,
  updateUser,
};
