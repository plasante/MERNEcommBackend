const express = require('express');
const router = express.Router();

const {sayHi, signUp} = require('../controllers/users');
const {userSignupValidator} = require('../validators');

router.get('/', sayHi);
router.post('/signup', userSignupValidator, signUp);

module.exports = router;
