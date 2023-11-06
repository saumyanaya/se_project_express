const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  CONFLICT,
  UNAUTHORIZED,
} = require("./errors");

const handleError = (req, res, err) => {
  if (err.code === 11000) {
    res
      .status(CONFLICT)
      .send({ message: "A user with that email already exists" });
  } else if (err.message === "Authentication Failed") {
    res.status(UNAUTHORIZED).send({ message: "Invalid email or password" });
  } else if (err.message === "Cannot delete another user's item") {
    res
      .status(FORBIDDEN)
      .send({ message: "Cannot delete another user's item" });
  } else {
    switch (err.name) {
      case "ValidationError":
        res.status(BAD_REQUEST).send({ message: "Validation failed" });
        break;
      case "CastError":
        res.status(BAD_REQUEST).send({ message: "Could not cast parameters" });
        break;
      case "ForbiddenError":
        res.status(FORBIDDEN).send({ message: "Forbidden Action" });
        break;
      case "DocumentNotFoundError":
        res.status(NOT_FOUND).send({ message: "Resource not found" });
        break;

      default:
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "Server encountered an error" });
    }
  }
};

module.exports = { handleError };
