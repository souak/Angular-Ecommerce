const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const { Category } = require("../model/category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({
      success: false,
    });
  }
  res.status(200).send(categoryList);
});

router.get("/:categoryId", async (req, res) => {
  const categoryItem = await Category.findById(req.params.categoryId);
  if (!categoryItem) {
    res.status(500).json({ message: "category with the given Id not found!" });
  }
  res.status(200).send(categoryItem);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  category = await category.save();
  if (!category) {
    return res.status(404).send("the category cannot be created!");
  }
  res.send(category);
});

// router.delete("/:categoryId", (req, res) => {
//   Category.findByIdAndRemove(req.params.categoryId)
//     .then((category) => {
//       if (category) {
//         return res
//           .status(200)
//           .json({ success: true, message: "the category is deleted." });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "category is not found." });
//       }
//     })
//     .catch((err) => {
//       return res.status(400).json({ success: false, error: err });
//     });
// });

router.delete("/:categoryId", async (req, res) => {
  let category = await Category.findByIdAndRemove(req.params.categoryId);
  if (category) {
    return res
      .status(200)
      .json({ success: true, message: "category deleted." });
  } else {
    return res.status(404).json({
      success: false,
      message: "category not found!",
    });
  }
});

router.put("/:categoryId", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.categoryId,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }  // ture: show the updated category,,  false: show previous category
  );
  if (!category) {
    return res.status(404).json({message: 'category cannot be updated!'})
  }
  res.status(200).send(category)
});

module.exports = router;
