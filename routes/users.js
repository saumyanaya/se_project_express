const express = require("express");

const auth = require("../middlewares/auth");

const router = express.Router();

const { getUser, updateUser } = require("../controllers/users");

router.get("/me", auth, getUser);

router.patch("/me", auth, updateUser);

module.exports = router;
