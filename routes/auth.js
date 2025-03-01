const express = require('express');
const router = express.Router();

const {sayHi, signUp, signin, signout, requireSignin} = require('../controllers/auth');
const {userSignupValidator} = require('../validators');
const { body } = require('express-validator');

router.get('/', sayHi);
router.post('/signup', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Email must be between 3 to 32 characters')
    .isLength({ min: 3, max: 32 })
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @'),
  body('password', 'Password is required').notEmpty(),
  body('password', 'Password must be at least 6 chars long')
    .isLength({min: 6})
    .matches(/\d/)
    .withMessage('Password must contain a number')
], signUp);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
