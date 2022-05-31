const express = require("express");
const router = express.Router();
const { Product } = require("../model/product");
const { Category } = require("../model/category");
const mongoose = require("mongoose");

//GET

router.get("/", async (req, res) => {
  // 127.0.0.1:3000/api/v1/products?categories=5654613,468468465

  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  res.set({ "Content-Type": "application/json" });
  res.send(productList);
});

router.get("/:productId", async (req, res) => {
  const productItem = await Product.findById(req.params.productId);
  if (!productItem) {
    res.status(400).send({ message: "product Id not found!" });
  }
  res.status(200).send(productItem);
});

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments({});
  if (!productCount) {
    res.status(400).send({ message: "productCount Id not found!" });
  }
  res.status(200).send({ productCount: productCount });
});

router.get("/get/featured/:count?", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  console.log(count);
  const products = await Product.find({ isFeatured: true }).limit(+count);
  if (!products) {
    res.status(400).send({ message: "products Id not found!" });
  }
  res.status(200).send({ featuredProducts: products });
});

//POST

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category!");
  }

  let product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res.status(500).send("the product cannot be created!");
  }

  res.status(200).send(product);
});

// PUT

router.put("/:productId", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.productId)) {
    return res.status(400).send("invalid productId");
  }
  const category = await Category.findById(req.body.category).catch((err) => {
    return res.status(400).json({
      error: err,
    });
  });
  // if (!category) {
  //   return res.status(400).send("category Id not found!");
  // }

  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true } // ture: show the updated category,,  false: show previous category
  );
  if (!product) {
    return res.status(404).json({ message: "product cannot be updated!" });
  }
  res.status(200).send(product);
});

//DELETE

router.delete("/:productId", (req, res) => {
  Product.findByIdAndRemove(req.params.productId)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "product deleted." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
