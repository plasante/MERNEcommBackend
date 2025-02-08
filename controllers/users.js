const User = require('../models/user');
const {errorHandler} = require('../helpers/DbErrorHandler');

exports.sayHi = (req, res) => {
  res.json({message: 'Hello Json!'});
}

exports.signUp = async (req, res) => {
  //console.log('req.body', req.body);
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    savedUser.salt = undefined;
    savedUser.hashedPassword = undefined;
    res.json({ savedUser });
  } catch (err) {
    return res.status(400).json({ err: errorHandler(err) });
  }
};