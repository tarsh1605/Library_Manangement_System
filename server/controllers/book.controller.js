const Book = require('../models/book.model.js');


const createBook = async (req, res) => {
  const { title, author, category, availableCopies, totalCopies,coverImage } = req.body;

  const book = new Book({
    title,
    author,
    category,
    availableCopies,
    totalCopies,
     coverImage
  });

  const savedBook = await book.save();
  res.status(201).json(savedBook);
};


const getBooks = async (req, res) => {
   const { search } = req.query;

  let filter = {};
  if (search) {
    const regex = new RegExp(search, "i");
    filter = {
      $or: [
        { title: { $regex: regex } },
      ]
    };
  }

  const books = await Book.find(filter);
  res.json(books);
};



const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
};


const updateBook = async (req, res) => {
  const { title, author, category, availableCopies, totalCopies,coverImage } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  book.title = title || book.title;
  book.author = author || book.author;
  book.category = category || book.category;
  book.availableCopies = availableCopies ?? book.availableCopies;
  book.totalCopies = totalCopies ?? book.totalCopies;
  book.coverImage = coverImage ?? book.coverImage;
//In my code, I used the Nullish Coalescing Operator (??) to update fields like availableCopies only when a new value is provided.

//It ensures that values like 0 — which are valid for book counts — are not mistakenly ignored, unlike the logical OR (||) which treats 0, false, or empty strings as false.
  const updatedBook = await book.save();
  res.json(updatedBook);
};


const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  await book.deleteOne();
  res.json({ message: 'Book removed' });
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
};
