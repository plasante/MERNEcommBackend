const express = require('express');
const router = express.Router();

const {sayHi, signUp, signin, signout, requireSignin} = require('../controllers/auth');
const {userSignupValidator} = require('../validators');
const res = require("express/lib/response");

router.get('/', sayHi);
//router.post('/signup', userSignupValidator, signUp);
router.post('/signup', signUp);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
