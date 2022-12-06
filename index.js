const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartItemRoutes = require("./routes/cartItemRoutes");
const orderRoutes = require("./routes/orderRoutes");

const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Server } = require("socket.io");
const http = require("http");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//     optionSuccessStatus: 200,
//   },
// });

dotenv.config();
connectDB();
app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartItemRoutes);
app.use("/api/orders", orderRoutes);

// let users = [];
// const addUser = (user, socketId) => {
//   !users.some((u) => u?.user?._id === user?._id) &&
//     users.push({ user, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user?.socketId !== socketId);
// };

// const getUser = (user) => {
//   return users.find((u) => u.user?._id === user?._id);
// };

// io.on("connection", (socket) => {
//   socket.on("setup", (userData) => {
//     console.log(`${userData?.name} connecting`);
//     addUser(userData, socket.id);
//   });
//   socket.on("create_order_success", () => {
//     const userOthers = users.filter((u) => u.user?.role !== 1);
//     // userOthers.forEach((u) => {
//     //   io.to(`${u?.socketId}`).emit("newOrder", u.user?.name);
//     // });
//     io.emit("newOrder", userOthers[0].user?.name);
//   });
//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//     removeUser(socket.id);
//   });
// });

// if (process.env.NODE_ENV === "production") {
//   app.get("*", (req, res) => {
//     res.send("API RUNNING SUCCESS");
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send({ response: "Server is up and running." }).status(200);
//   });
// }

app.listen(process.env.PORT || 5000, () => {
  console.log("Server listening ");
});
