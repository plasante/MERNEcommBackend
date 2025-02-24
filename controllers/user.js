const User = require('../models/user');
const res = require("express/lib/response");

exports.userById = async (req, res, next, id) => {
  try {
    // This id comes from the routes parameter
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'An error occured'
    });
  }
};

exports.read = (req, res, next) => {
  try {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
  } catch(err) {
    return res.status(400).json({
      error: 'An error occured'
    });
  }
}

exports.update = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true});
    updatedUser.salt = undefined;
    updatedUser.hashed_password = undefined;
    res.json(updatedUser);
  } catch (err) {
    return res.status(400).json({
      error: 'Error updating user'
    });
  }

}