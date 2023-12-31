const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  CONFLICT,
  UNAUTHORIZED,
} = require("./errors");

function handleUserHttpError(req, res, err) {
  switch (err.name) {
    case "MongoServerError":
      if (err.code === 11000) {
        res.status(CONFLICT).send({ message: "duplicate email id" });
      }
      break;

    case "Request Refuse":
      res
        .status(FORBIDDEN)
        .send({ message: "the item is owned by other user" });
      break;
    case "DocumentNotFoundError":
      res
        .status(NOT_FOUND)
        .send({ message: `user id ${req.params.id} couldn't be found` });
      break;
    case "CastError":
      res.status(BAD_REQUEST).send({ message: "id is incorrect format" });
      break;
    case "ValidationError":
      res
        .status(BAD_REQUEST)
        .send({ message: "id is incorrect format or information is missing" });
      break;
    case "Error":
      res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
      break;
    default:
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `An ${err.name} error has occurred on the server` });
      break;
  }
}

function handleItemHttpError(req, res, err) {
  switch (err.name) {
    case "Request Refuse":
      res
        .status(FORBIDDEN)
        .send({ message: "the item is owned by other user" });
      break;
    case "DocumentNotFoundError":
      res
        .status(NOT_FOUND)
        .send({ message: `item id ${req.params.itemId} couldn't be found` });
      break;
    case "CastError":
      res.status(BAD_REQUEST).send({ message: "id is incorrect format" });
      break;
    case "ValidationError":
      res
        .status(BAD_REQUEST)
        .send({ message: "id is incorrect format, or information is missing" });
      break;
    case "Error":
      if (err.message === "Forbidden Access") {
        res.status(FORBIDDEN).send({
          message: "Forbidden Access",
        });
      }
      break;

    default:
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
      break;
  }
}
module.exports = {
  handleUserHttpError,
  handleItemHttpError,
};
