const Cart = require('../models/cart.model.js');
const Book = require('../models/book.model.js');
const asyncHandler=require('express-async-handler')


//Mongoose’s .populate() is used to automatically replace a field that stores a reference (like an ID) with the actual document from the referenced collection.

//I used .populate('items.book') so that when a user fetches their cart, they don’t just get book IDs. Instead, they get full book details like title, author, and category — which improves frontend usability and reduces additional queries.


const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.book");

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json(cart);
});


const addToCart = asyncHandler(async (req, res) => {

  const { bookId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(item => item.book.toString() === bookId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ book: bookId, quantity });
  }

  await cart.save();
  res.status(201).json(cart);
});


const updateCartItem = asyncHandler(async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user._id;

  if (!bookId || quantity == null) {
    res.status(400);
    throw new Error("Book ID and quantity are required");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find((item) => item.book.toString() === bookId);
  if (!item) {
    res.status(404);
    throw new Error("Book not in cart");
  }

  if (quantity === 0) {
    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();


  const updatedCart = await Cart.findOne({ user: userId }).populate("items.book");

  res.json(updatedCart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const bookId = req.params.bookId;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(item => item.book.toString() !== bookId);
  await cart.save();

  res.json(cart);
});


module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeCartItem
};



//I use req.body to accept data from the client when creating or updating something — like adding a book to the cart. I use req.params when I'm accessing a specific resource identified by the URL — like deleting a specific cart item using its book ID.


// req.body – for sending data
// Used when you're sending content like JSON in the request body.

// req.params – for identifying a specific resource
// Used when your route includes a dynamic part, like an ID.

//req.query – for filters/sorting
