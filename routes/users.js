const express = require("express");

const auth = require("../middlewares/auth");

const { validateUserUpdate } = require("../middlewares/validation");

const router = express.Router();

const { getUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getUser);

router.patch("/me", auth, validateUserUpdate, updateUser);

module.exports = router;
