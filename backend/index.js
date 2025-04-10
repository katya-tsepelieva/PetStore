require("dotenv").config();
const express = require("express");
require("./config/db"); 
const cors = require("cors");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favouritesRoutes = require("./routes/favouritesRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials: true, 
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json()); 
app.use(bodyParser.json()); 

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", reviewRoutes);
app.use("/api/favourites", favouritesRoutes);
app.use("/api/admin", adminRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
