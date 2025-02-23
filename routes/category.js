const express = require('express');
const router = express.Router();
const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/auth');
const { userById } = require('../controllers/user');

const {
  create, categoryById, read
} = require('../controllers/category');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);


// We run categoryById middleware when categoryId is not null
// req.category will be add to the request object
router.param('categoryId', categoryById);

router.param('userId', userById);

module.exports = router;