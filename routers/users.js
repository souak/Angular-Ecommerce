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

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(400).send({ message: "productCount Id not found!" });
  }
  res.status(200).send({ userCount: userCount });
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
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.SECRET,
        {
          expiresIn: "1w",
        }
      );
      return res.status(200).send({ user: user.email, token: token });
    } else {
      return res.status(400).send("password is wrong!");
    }
  } catch {
    return res.status(500).send("there is an error!");
  }
});

router.post("/register", async (req, res) => {
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
    isAdmin: false,
  });

  user = await user.save();
  if (!user) {
    return res.status(400).send("the user cannot be created!");
  }

  res.send(user);
});

// DELETE

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(400).send("user not found!");
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      return res.status(500).json({success: false, error: err})
    });
});

module.exports = router;
