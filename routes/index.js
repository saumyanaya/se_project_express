const router = require("express").Router();
const user = require("./users");
const clothingItem = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.use("/users", user);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "router not found" });
});

module.exports = router;
