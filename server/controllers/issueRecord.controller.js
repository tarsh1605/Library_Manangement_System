const asyncHandler = require('express-async-handler');
const IssueRecord = require('../models/issueRecord.model.js');
const Book = require('../models/book.model.js');
const Cart = require('../models/cart.model.js');
const User=require("../models/user.model.js")
const Fine=require("../models/fine.model.js")
const borrowBooks = asyncHandler(async (req, res) => {
  const userId = req.user._id;


  const cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }


  for (let item of cart.items) {
    const book = item.book;
    if (book.availableCopies < item.quantity) {
      res.status(400);
      throw new Error(`Not enough copies available for ${book.title}`);
    }
  }


  const issueRecords = [];
  
  await Promise.all(
    cart.items.flatMap(item => {
      const promises = [];
      const book = item.book;

  
      for (let i = 0; i < item.quantity; i++) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); 
        // dueDate.setDate(dueDate.getDate() -1);  for testing purpose
      
        const issuePromise = IssueRecord.create({
          user: userId,
          book: book._id,
          dueDate
        }).then(record => {
          issueRecords.push(record);
        });

        promises.push(issuePromise);
      }
      book.availableCopies -= item.quantity;
      const saveBookPromise = book.save();
      promises.push(saveBookPromise);

      return promises;
    })
  );

  cart.items = [];
  await cart.save();

  res.status(201).json({
    message: 'Books issued successfully',
    issueRecords
  });
});
const returnBook = asyncHandler(async (req, res) => {
  const issue = await IssueRecord.findById(req.params.id).populate('book user');
  if (!issue) {
    res.status(404);
    throw new Error('Issue record not found');
  }

  if (issue.returnedAt) {
    res.status(400);
    throw new Error('Book already returned');
  }

  issue.returnedAt = new Date();

  const lateDays = Math.ceil((issue.returnedAt - issue.dueDate) / (1000 * 60 * 60 * 24));

  if (lateDays > 0) {
    const fineAmount = lateDays * 5;
    issue.fineAmount = fineAmount;

    
    await Fine.create({
      user: issue.user._id,
      book: issue.book._id,
      amount: fineAmount,
      paid: false,
    });
  }

  await issue.save();

  issue.book.availableCopies++;
  await issue.book.save();

  res.json({ message: 'Book returned successfully', issue });
});

const getAllIssueRecords = asyncHandler(async (req, res) => {
  const { search, title } = req.query;

  const query = {};

  if (search) {
    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("_id");

    const userIds = users.map((u) => u._id);
    query.user = { $in: userIds };
  }

  if (title) {
    const books = await Book.find({
      title: { $regex: title, $options: "i" },
    }).select("_id");

    const bookIds = books.map((b) => b._id);
    query.book = { $in: bookIds };
  }

  const records = await IssueRecord.find(query)
    .populate("user", "username")
    .populate("book", "title author coverImage")
    .sort({ createdAt: -1 }); 

  res.json(records);
});



const getUserIssueRecords = asyncHandler(async (req, res) => {
  const records = await IssueRecord.find({ user: req.user._id })
    .populate('book')
    .sort({ createdAt: -1 }); 

  res.json(records);
});





module.exports = {
  borrowBooks,
  returnBook,
  getAllIssueRecords,
  getUserIssueRecords
};