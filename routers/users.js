const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const bcrypt = require('bcryptjs');

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
        return res.status(400).send({error: err})
    });

 
});

module.exports = router;
