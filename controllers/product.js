const formidable = require("formidable");
const _ = require("lodash");
const Product = require('../models/product');
const fs = require('fs');
const {errorHandler} = require('../helpers/DbErrorHandler');

exports.productById = async (req, res, next, id) => {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Product not found"
      });
    }
}

exports.read = async (req, res, next) => {
  req.product.photo = undefined;
  return res.json(req.product);
}

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  await form.parse(req, async (err, fields, files) => {
    //console.log('files = ', files)
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }

    // Process all other form fields, ensuring no empty arrays stay
    for (let key in fields) {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0];
      }
    }

    if (!files.photo) {
      return res.status(400).json({
        error: "Image is required"
      });
    }

    if (!fields.name || !fields.description || !fields.price || !fields.category || !fields.quantity || !fields.shipping) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // Create a new product with the fields
    const newProduct = new Product(fields);

    // If a file was uploaded and there's a file path, read the file into the product
    if (files.photo && files.photo[0].filepath) {
      if (files.photo[0].size > 1000000) {
        return res.status(400).json({
          error: "Image size should be less than 1MB"
        })
      }
      newProduct.photo.data = fs.readFileSync(files.photo[0].filepath);
      newProduct.photo.contentType = files.photo[0].type;
    }

    // Log newProduct to check if photo data is there
    //console.log(newProduct);

    try {
      // Save the product and wait for result
      const product = await newProduct.save();

      // Find the product and log it
      const foundProduct = await Product.findById(product._id);
      //console.log('Saved product', foundProduct);

      // Return the product's JSON
      res.json({product});
    } catch (err) {
      //console.log(err);
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
  });
};