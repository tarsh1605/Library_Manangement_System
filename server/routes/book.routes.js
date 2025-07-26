const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/book.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const { adminOnly } = require('../middleware/role.middleware.js');

router.route('/')
  .post(protect, adminOnly, createBook) 
  .get(getBooks); 

router.route('/:id')
  .get(getBookById)
  .put(protect, adminOnly, updateBook)
  .delete(protect, adminOnly, deleteBook);

module.exports = router;
