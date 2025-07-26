const asyncHandler = require('express-async-handler');
const Fine = require('../models/fine.model.js');
const User=require('../models/user.model.js')

const getMyFines = asyncHandler(async (req, res) => {
  const fines = await Fine.find({ user: req.user._id }).populate('book', 'title');
  res.json(fines);
});


const payFine = asyncHandler(async (req, res) => {
  const fine = await Fine.findById(req.params.id);
  if (!fine) {
    res.status(404);
    throw new Error('Fine not found');
  }

  if (fine.paid) {
    res.status(400);
    throw new Error('Fine already paid');
  }

  fine.paid = true;
  await fine.save();

  res.json({ message: 'Fine marked as paid' });
});

const getAllFines = asyncHandler(async (req, res) => {
  const { username } = req.query;

  const query = {};

  if (username) {

    const user = await User.findOne({ username: new RegExp(username, 'i') });
    if (user) {
      query.user = user._id;
    } else {
      return res.json([]); 
    }
  }

  const fines = await Fine.find(query)
    .populate('user', 'username')
    .populate('book', 'title');

  res.json(fines);
});


module.exports = {
  getMyFines,
  getAllFines,
  payFine
};
