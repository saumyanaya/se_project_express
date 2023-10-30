const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const { getUsers, getUser } = require("../controllers/user");

//READ
router.get("/me", auth, getUsers);

//UPDATE
router.patch("/me", auth, getUser);

//DELETE

module.exports = router;
