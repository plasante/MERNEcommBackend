const Category = require('../models/category');
const { errorHandler} = require('../helpers/DbErrorHandler');
const Product = require("../models/product");

exports.read = (req, res) => {
  return res.json(req.category);
}

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    req.category = category;
    next();
  } catch(err) {
    return res.status(400).json({
      error: "Category not found"
    });
  }
}

exports.create = async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const category = await newCategory.save();
    res.json({ category });
  }
  catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }
}

exports.update = async (req, res) => {
  const { id } = req.params;
  const category = req.category;
  category.name = req.body.name;
  try {
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }
}

exports.remove = async (req, res) => {
  const category = req.category;

  if (!category) {
    return res.status(400).json({
      error: "Category not found",
    });
  }

  try {
    // Use the Model's deleteOne method
    await Category.deleteOne({ _id: category._id });
    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
}