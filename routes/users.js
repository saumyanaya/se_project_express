const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/users");

//READ
router.get("/me", auth, getUser);

//UPDATE
router.patch("/me", auth, updateUser);

//DELETE

module.exports = router;
