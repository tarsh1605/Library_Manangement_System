const express=require('express');
const router=express.Router();
const {borrowBooks,
  returnBook,
  getAllIssueRecords,
  getUserIssueRecords}=require("../controllers/issueRecord.controller.js");
const {protect}=require('../middleware/auth.middleware.js');
const {adminOnly}=require('../middleware/role.middleware.js');
router.post('/borrow', protect, borrowBooks);
router.put('/return/:id', protect, returnBook);
router.get('/admin/all', protect,adminOnly, getAllIssueRecords);
router.get('/my', protect,getUserIssueRecords);
module.exports = router;
