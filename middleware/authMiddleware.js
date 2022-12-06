const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(400).json("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(400).json("Not authorized, no token");
  }
};

const admin = (req, res, next) => {
  if (req.user?.role === 0) {
    next();
  } else {
    res.status(400).json("Not is admin");
  }
};

module.exports = { protect, admin };
