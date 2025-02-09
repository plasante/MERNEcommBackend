const express = require('express');
const router = express.Router();

const {sayHi, signUp, signin, signout} = require('../controllers/users');
const {userSignupValidator} = require('../validators');

router.get('/', sayHi);
router.post('/signup', userSignupValidator, signUp);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
