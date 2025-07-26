const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware.js');
const {adminOnly}=require('../middleware/role.middleware.js')
const { getAdminStats,getAllUsers } = require('../controllers/admin.controller.js');
const {getAllIssueRecords,returnBook}=require('../controllers/issueRecord.controller.js');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get("/issued-books", protect, adminOnly, getAllIssueRecords);
router.get('/users', protect, adminOnly, getAllUsers);
router.put("/return-book/:id", protect, adminOnly, returnBook);

module.exports = router;
