const User = require('../models/user');

exports.sayHi = (req, res) => {
  res.json({message: 'Hello Json!'});
}

exports.signUp = (req, res) => {
  //console.log('req.body', req.body);
  const user = new User(req.body);
  user.save().then(savedUser => {
    res.json({ savedUser });
  }).catch(err => {
    return res.status(400).json({ message: err });
  });
};