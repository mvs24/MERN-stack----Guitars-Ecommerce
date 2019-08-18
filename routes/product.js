const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const { auth } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

router.post("/article", auth, admin, (req, res) => {
  const newProduct = new Product(req.body);
  newProduct
    .save()
    .then(savedProduct => {
      res.status(200).json({
        success: true,
        article: savedProduct
      });
    })
    .catch(err => {
      res.status(400).json({ success: false });
    });
});

router.get("/articles_by_id", (req, res) => {
  // check if we have some ids or one
  let type = req.query.type;
  let items = req.query.id;
  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map(id => {
      return mongoose.Types.ObjectId(id);
    });
  }

  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec((err, docs) => {
      return res.status(200).json({
        docs
      });
    });
});

// by arrivals  /articles?sortBy=createdAt&order=desc&limit=4
router.get("/articles", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).json({ success: false, err });
      res.send(articles)
    });
});

// by sell  /articles?sortBy=sold&order=desc&limit=4

module.exports = router;
