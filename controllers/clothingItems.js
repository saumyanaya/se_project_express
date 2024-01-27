const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/BadRequestError");
const { ForbiddenError } = require("../utils/ForBiddenError");
const { NotFoundError } = require("../utils/NotFoundError");

function getItems(req, res, next) {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      next(err);
    });
}

function createItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === `ValidationError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
}

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("Forbidden Access");
      }
      ClothingItem.findByIdAndDelete(item._id).then(() => {
        res.status(200).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
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
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
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
      res.status(200).send(dislike);
    })
    .catch((err) => {
      if (err.name === `DocumentNotFoundError`) {
        next(new NotFoundError());
      }
      if (err.name === `CastError`) {
        next(new BadRequestError("Invalid data"));
      }
      next(err);
    });
}

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
