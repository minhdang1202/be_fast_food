const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/ProductModel");

router.get("/", async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sortBy = Number(req.query.sort) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};
    const count = await Product.countDocuments({ ...keyword });

    let sortObject = {};
    switch (sortBy) {
      case 1:
        sortObject = {
          name: 1,
          _id: -1,
        };
        break;
      case 2:
        sortObject = {
          name: -1,
          _id: -1,
        };
        break;
      case 3:
        sortObject = {
          price: -1,
          _id: -1,
        };
        break;
      case 4:
        sortObject = {
          price: 1,
          _id: -1,
        };
        break;
      default:
        sortObject = {
          _id: -1,
        };
        break;
    }
    var products = await Product.find({ ...keyword })
      .sort(sortObject)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      products,
      page,
      pageSize,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const nameExists = await Product.findOne({ name });
    if (nameExists) {
      res.status(400).json("Product already exists");
    } else {
      const newProduct = new Product({
        name,
        // image,
        description,
        // rating,
        // numReview,
        price,
        // reviews,
        category,
      });
      const product = await newProduct.save();

      res.status(200).json(product);
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.delete("/:id", protect, async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.status(200).json("Delete successfully id : " + product._id);
    } else res.status(400).json("Don't find product to delete");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:id", protect, async (req, res) => {
  const { name, price, description } = req.body;
  const id = req.params.id;
  try {
    const newProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name,
        description: description,
        price: price,
        // image: image,
      },

      { new: true }
    );

    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/:id/review", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const id = req.params.id;
  try {
    const product = await Product.findById(id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user._id.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400).json("Product already Reviewed");
      } else {
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };

        product.reviews.push(review);
        product.numReview = product.reviews.length;
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
        await product.save();
        res.status(200).json(product);
      }
    } else {
      res.status(404).json("Product not found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
