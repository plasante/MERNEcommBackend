const formidable = require("formidable");
const _ = require("lodash");
const Product = require('../models/product');
const fs = require('fs');
const { errorHandler } = require('../helpers/DbErrorHandler');

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    const newProduct = new Product(fields);

    if (files.photo) {
      newProduct.photo.data = fs.readFileSync(files.photo.path);
      newProduct.photo.contenType = files.photo.type;
    }

    try {
      const product = newProduct.save();
      res.json({ product });
    } catch (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };
  });
}