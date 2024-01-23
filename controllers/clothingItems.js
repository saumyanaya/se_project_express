const ClothingItem = require("../models/clothingItem");
const { OK, CREATED } = require("../utils/errors");
const { handleItemHttpError } = require("../utils/errorHandlers");

function getItems(req, res, next) {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((err) => {
      handleItemHttpError(req, res, next(err));
    });
}

function createItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      handleItemHttpError(req, res, next(err));
    });
}

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new Error("Forbidden Access");
      }
      ClothingItem.findByIdAndDelete(item._id)
        .then(() => {
          res.status(OK).send({ message: "Item deleted" });
        })
        .catch((err) => {
          handleItemHttpError(req, res, next(err));
        });
    })
    .catch((err) => {
      handleItemHttpError(req, res, next(err));
    });
};

function likeItem(req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.status(OK).send(like);
    })
    .catch((err) => {
      handleItemHttpError(req, res, next(err));
    });
}

function dislikeItem(req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((dislike) => {
      res.status(OK).send(dislike);
    })
    .catch((err) => {
      handleItemHttpError(req, res, next(err));
    });
}

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
