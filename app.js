const express = require('express');
const res = require("express/lib/response");
const console = require("node:console");
const mongoose = require("mongoose");
require("dotenv").config();

// import routes
const userRoutes = require("./routes/users");

// app
const app = express();

// routes middleware
app.use('/api', userRoutes);

// connections to MongoDB
const port = process.env.PORT || 8000;
mongoose.connect(
  `mongodb+srv://plasante:${process.env.MONGODB_PASSWORD}@cluster0.enctu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
  .then(() =>
    app.listen(port, () => console.log(`Connection Successfull to MongoDB & Listening on port ${port}.`))
  )
  .catch((err) => console.log(err));