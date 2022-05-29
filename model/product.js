const mongoose = require("mongoose");
const { Category } = require("./category");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [{ type: String }],
  brand: {
    type: String,
  },
  price:{
    type: Number
  },
  category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews:{
    type: Number,
    default: 0
  },
  isFeatured:{
    type: Boolean,
    default: false
  },
  dateCreated:{
    type: Date,
    default: Date.now
  }
});
// const Product = mongoose.model("Product", productSchema);
// module.exports = Product
exports.Product = mongoose.model("Product", productSchema);
