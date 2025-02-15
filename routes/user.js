const express = require('express');
const router = express.Router();

const {
  requireSignin,
  isAuth,
  isAdmin
} = require('../controllers/auth');

const {
  userById
} = require('../controllers/user');

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, async (req, res) => {
  res.json({
    user: req.profile
  })
});

// We execute userById each time the userId is present
// The value will be available in the request object
router.param('userId', userById);

module.exports = router;