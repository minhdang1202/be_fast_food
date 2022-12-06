const router = require("express").Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

router.post("/", async (req, res) => {
  const { name, email, password, pic } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    if (!name || !email || !password) {
      res.status(400).json("Please Enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json("User already exists");
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    const user = await newUser.save();
    res.status(200).json({ ...user._doc, token: generateToken(user._id) });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        role: user.role,
        token: generateToken(user._id),
        address: user.address,
      });
    } else {
      res.status(400).json("Invalid Email or Password");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        pic: user.pic,
        phone: user.phone,
        address: user.address,
      });
    } else {
      res.status(400).json("Not found");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;

      if (req.body.password !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
      }

      const updateUser = await user.save();
      res.status(200).json({
        _id: updateUser._id,
        name: updateUser.name,
        phone: updateUser.phone,
        role: updateUser.role,
        updatedAt: updateUser.createdAt,
        token: generateToken(updateUser._id),
        address: user.address,
      });
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//get all users or search user
router.get("/", protect, admin, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//change role
router.post("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = user.role === 2 ? 1 : 2;
    } else {
      res.status(404).json("Không tìm thấy user!");
    }
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
