const express = require('express');
const res = require("express/lib/response");
const console = require("node:console");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const expressValidator = require("express-validator");
require("dotenv").config();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

// app
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// connections to MongoDB
const port = process.env.PORT || 8000;
mongoose.connect(
  `mongodb+srv://plasante:${process.env.MONGODB_PASSWORD}@cluster0.enctu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
  .then(() =>
    app.listen(port, () => console.log(`Connection Successfull to MongoDB & Listening on port ${port}.`))
  )
  .catch((err) => console.log(err));