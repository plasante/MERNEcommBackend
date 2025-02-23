const Category = require('../models/category');
const { errorHandler } = require('../helpers/DbErrorHandler');
const res = require("express/lib/response");
const {next} = require("lodash/seq");

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