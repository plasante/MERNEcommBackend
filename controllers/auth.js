const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate a signed token
const expressJwt = require('express-jwt'); // for authorization check
const {errorHandler} = require('../helpers/DbErrorHandler');
require("express/lib/response");
const process = require("node:process");
const { validationResult } = require('express-validator');

exports.sayHi = (req, res) => {
  res.json({message: 'Hello Json!'});
}

exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0]
    return res.status(400).json({ error: firstError });
  }
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    savedUser.salt = undefined;
    savedUser.hashedPassword = undefined;
    res.status(200).json({ savedUser });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err) });
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

exports.requireSignin = expressJwt.expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // Vous devez aussi spécifier les algorithmes utilisés
  userProperty: 'auth'
});

exports.isAuth = (req, res, next) => {
  const user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied!.'
    })
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role.type === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied.'
    })
  }
  next();
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