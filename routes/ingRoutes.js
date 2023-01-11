const router = require("express").Router();
const { protect, admin } = require("../middleware/authMiddleware");
const Ingredient = require("../models/Ingredient");
const moment = require("moment");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

router.get("/",protect, admin, async (req, res) => {
  try {
    const ings = await Ingredient.find({});

    res.status(200).json(ings);
  } catch (e) {
    res.status(500).json(e.message);
  }
});


router.get("/recomment", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({
      createdAt: { $gte: moment().subtract(7, "days") },
    })
      .populate("orderItems", "product")
      .then(async (results) => {
        results = await Product.populate("ingredients");
      });
    let ings = [];
    let ingsRecomment = [];
    orders?.map((order) => order.orderItems.forEach(element => {
        if(element?.product?.ingredients !== undefined)
            ings.push(element?.product?.ingredients)
     
    }
    ));
    ings.map((ing) => ing.forEach(item => {
        if(ingsRecomment.some(ingRecomment?.name === item.name)) {
            ingsRecomment[ingsRecomment.indexOf(ingRecomment)] = {...ingRecomment, mass : ingRecomment.mass + item.mass}
        } else {
            ingsRecomment.push(item);
        }
    }))
    res.status(200).json(ingsRecomment);
  } catch (e) {
    res.status(500).json(e.message);
  }
});



router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, mass } = req.body;
    const nameExists = await Ingredient.findOne({ name });
    if (nameExists) {
      const newIng = await Ingredient.findByIdAndUpdate(
        nameExists._id,
        {
          name: name,
          mass: mass,
        },

        { new: true }
      );

      res.status(200).json(newIng);
    } else {
      const newIng = await Ingredient.create({
        name,
        mass
      });

      res.status(201).json(newIng);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});


module.exports = router;
