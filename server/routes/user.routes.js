const express = require('express');
const {
  registerUser,
  loginUser,
  getProfile
} = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { getUserIssueRecords,borrowBooks } = require('../controllers/issueRecord.controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/issued-books', protect, getUserIssueRecords);
router.post('/borrow', protect, borrowBooks);
module.exports = router;
