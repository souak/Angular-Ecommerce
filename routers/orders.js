const express = require("express");
const router = express.Router();
const { Order } = require("../model/order");
const { OrderItem } = require("../model/order-item");

//GET
router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrder: -1 }); // sort from newes to oldest create date
  if (!orderList) {
    return res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: { path: "category" } },
    });
  if (!order) {
    return res.status(500).json({ success: false });
  }
  res.send(order);
});

//POST

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  console.log(orderItemsIdsResolved);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });

  order = await order.save();
  if (!order) {
    return res.status(404).send("the order cannot be created!");
  }
  res.send(order);
});

//PUT

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true } // returns the updated data not the old one.
  );

  if (!order) {
    return res.status(400).send("the order cannot be updated!");
  }

  res.send(order);
});

//DELETE

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (!order) {
        return res
          .status(400)
          .send({ success: false, message: "cannot delete the order!" });
      } else {
        return res
          .status(200)
          .send({ success: true, message: "order is deleted!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
