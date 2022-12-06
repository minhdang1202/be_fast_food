const router = require("express").Router();
const { protect, admin } = require("../middleware/authMiddleware");
const Order = require("../models/OrderModel");
const moment = require("moment");

router.post("/", protect, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    shippingPrice,
    itemsPrice,
    cartTotalAmount,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400).json("No order items");
      return;
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((orderItem) => {
          return {
            ...orderItem,
            product: orderItem._id,
          };
        }),
        shippingAddress,
        paymentMethod,
        totalAmount,
        shippingPrice,
        itemsPrice,
        cartTotalAmount,
      });
      var createOrder = await order.save();
      res.status(200).json(createOrder);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/all", protect, admin, async (req, res) => {
  try {
    const order = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email ");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/all/filter", protect, async (req, res) => {
  const day = req.query.day;

  const lastTime = (day, createdAt) => {
    if (day === "7") {
      return createdAt >= moment().subtract(7, "days");
    }
    if (day === "30") {
      return createdAt >= moment().subtract(1, "month");
    }
    return createdAt >= moment().subtract(1, "day");
  };

  //0- Get all; 1- Process; 2- Received; 3- Completed; 4- Cancelled
  const status = req.query.status;
  let filterOrder = [];
  try {
    const order = await Order.find()
      .sort({ _id: -1 })
      .populate("user", "id name email ");
    if (Number(status) === 0) {
      filterOrder = order
        .filter((o) => o.status >= 0)
        .filter((o) => lastTime(day, o.createdAt));
    } else {
      Number(status) === 2
        ? (filterOrder = order
            .filter((o) => o?.shipper?.equals(req.user._id))
            .filter((o) => lastTime(day, o.createdAt)))
        : (filterOrder = order
            .filter((o) => o.shipper === req.user._id)
            .filter((o) => o.status === Number(status))
            .filter((o) => lastTime(day, o.createdAt)));
    }
    res.status(200).json(filterOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shipper", "name email");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id/delivered", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 3;
    }

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id/paid", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order?.isDelivered) {
      order.status = req.body.status;
    }
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id/shipping", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.shipper = req.user._id;
    }
    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
