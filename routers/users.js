const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//GET

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    return res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const userItem = await User.findById(req.params.id).select("-passwordHash");
  if (!userItem) {
    return res.status(500).json({ success: false });
  }
  res.send(userItem);
});

//POST

router.post("/", (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password),
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    country: req.body.country,
    zip: req.body.zip,
    isAdmin: req.body.isAdmin,
  });

  user
    .save()
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(400).send({ error: err });
    });
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("user not found!");
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign({ userId: user.id }, "hashsecret", {expiresIn: '1w'});
      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res.status(400).send("password is wrong!");
    }
  } catch {
    return res.status(500).send("there is an error!");
  }
});

module.exports = router;
