const router = require("express").Router();
const user = require("./users");
const clothingItem = require("./clothingItems");
const { NotFoundError } = require("../utils/NotFoundError");
const auth = require("../middlewares/auth");

router.use("/users", auth, user);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

module.exports = router;
