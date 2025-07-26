const asyncHandler = require('express-async-handler');
const Book = require('../models/book.model.js');
const User = require('../models/user.model.js'); 
const IssueRecord = require('../models/issueRecord.model.js');
const Fine = require('../models/fine.model.js');


const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalCustomers = await User.countDocuments({ role: "customer" });

  const totalBooks = await Book.countDocuments();
  const totalAvailableCopies = await Book.aggregate([
    { $group: { _id: null, total: { $sum: "$availableCopies" } } },
  ]);

  const totalIssued = await IssueRecord.countDocuments();
  const currentlyIssued = await IssueRecord.countDocuments({ returnedAt: null });

  res.json({
    totalUsers,
    totalAdmins,
    totalCustomers,
    totalBooks,
    totalAvailableCopies: totalAvailableCopies[0]?.total || 0,
    totalIssued,
    currentlyIssued,
  });
});


const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  const records = await IssueRecord.find().select('user');

  const issuedCountMap = {};
  records.forEach(r => {
    const id = r.user.toString();
    issuedCountMap[id] = (issuedCountMap[id] || 0) + 1;
  });

  const userList = users.map(u => ({
    _id: u._id,
    username: u.username,
    role: u.role,
    issuedCount: issuedCountMap[u._id.toString()] || 0
  }));

  res.json(userList);
});
module.exports = {
  getAdminStats,getAllUsers
};
