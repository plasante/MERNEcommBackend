const formidable = require("formidable");
const _ = require("lodash");
const Product = require('../models/product');
const fs = require('fs');
const {errorHandler} = require("../helpers/DbErrorHandler");

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        error: "Product is blank"
      });
    }
    req.product = product;
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }
}

exports.remove = async (req, res) => {
  const product = req.product;

  if (!product) {
    return res.status(400).json({
      error: "Product not found",
    });
  }

  try {
    // Use the Model's deleteOne method
    await Product.deleteOne({_id: product._id});
    return res.json({message: "Product deleted successfully"});
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err),
    });
  }
};

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

exports.update = async (req, res) => {
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
    //const newProduct = new Product(fields);
    let updatedProduct = req.product;
    updatedProduct = _.extend(updatedProduct, fields);

    // If a file was uploaded and there's a file path, read the file into the product
    if (files.photo && files.photo[0].filepath) {
      if (files.photo[0].size > 1000000) {
        return res.status(400).json({
          error: "Image size should be less than 1MB"
        })
      }
      updatedProduct.photo.data = fs.readFileSync(files.photo[0].filepath);
      updatedProduct.photo.contentType = files.photo[0].type;
    }

    // Log newProduct to check if photo data is there
    //console.log(newProduct);

    try {
      // Save the product and wait for result
      const product = await updatedProduct.save();

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

/**
 * sell / arrival
 * We need to show the most popular products as well as the new products
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * If no params are sent, then all products are returned
 */

exports.list = async (req, res) => {
  try {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? req.query.limit : 6;
    const products = await Product.find()
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(parseInt(limit));
    res.json(products);

  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }
}

/**
 * It will find the products based on the req product category
 * other products that have the same category will be returned.
 */
exports.listRelated = async (req, res) => {
  try {
    let limit = req.query.limit ? req.query.limit : 6;
    console.log('testing nodemon by Karo')
    const relatedProducts = await Product.find({_id: {$ne: req.product}, category: req.product.category})
      .limit(parseInt(limit))
      .populate('category', '_id name');
    res.json(relatedProducts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }
}

exports.listCategories = async (req, res) => {
  try {
    const distinctCategories = await Product.distinct("category");
    res.json(distinctCategories);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler(err)
    });
  }

}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  try {
    const data = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
    res.json({
      size: data.length,
      data
    });
  } catch (err) {
    return res.status(400).json({
      error: "Products not found"/**/
    });
  }
};

exports.photo = async (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
}