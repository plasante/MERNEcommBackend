const express = require('express');
const router = express.Router();

const {sayHi, signUp} = require('../controllers/users');

router.get('/', sayHi);
router.post('/signup', signUp);

module.exports = router;
