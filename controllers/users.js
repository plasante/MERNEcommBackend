const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate a signed token
const expressJwt = require('express-jwt'); // for authorization check
const {errorHandler} = require('../helpers/DbErrorHandler');
const res = require("express/lib/response");

exports.sayHi = (req, res) => {
  res.json({message: 'Hello Json!'});
}

exports.signUp = async (req, res) => {
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

exports.signout = async (req, res) => {
  try {
    res.clearCookie('t');
    res.json({ message: 'Signout Success' });
  } catch (err) {
    return res.status(400).json({ error: 'Signout failed' });
  }
}

exports.signin = async (req, res) => {
  const signinEmail = req.body.email;
  const signinPassword = req.body.password;

  if (!signinEmail || !signinPassword) {
    return res.status(400).json({ error: 'Both email and password must be present' });
  }

  try {
    const user = await User.findOne({ email: signinEmail });

    if (!user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup'
      });
    }

    if (!user.authenticate(signinPassword)) {
      return res.status(401).json({ error: 'Email and password do not match' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('t', token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });

  } catch (err) {
    //console.error(err);
    return res.status(400).json({ error: 'Authentication failed' });
  }
}