const Category = require('../models/category');
const { errorHandler } = require('../helpers/DbErrorHandler');

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