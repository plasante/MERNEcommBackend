const res = require("express/lib/response");
exports.userSignupValidator = function(req, res, next) {
  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Email must be between 3 to 32 chars')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
      min: 4,
      max: 32,
    });
  req.check('password', 'Password is required').notEmpty();
  req.check('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('Password must contain a number');
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map(error => error.msg)[0]
    return res.status(400).json({ error: firstError });
  }
  next();
}