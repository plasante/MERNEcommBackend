const express = require('express');
const router = express.Router();

const {sayHi, signUp, signin} = require('../controllers/users');
const {userSignupValidator} = require('../validators');

router.get('/', sayHi);
router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signin);

module.exports = router;
