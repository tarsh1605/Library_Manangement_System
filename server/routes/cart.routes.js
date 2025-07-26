const express = require('express');
const router = express.Router();
const {
  getUserCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require('../controllers/cart.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

router.route('/')
  .get(protect, getUserCart)
  .put(protect, updateCartItem);
router.route('/add').post(protect, addToCart);
router.route('/:bookId')
  .delete(protect, removeCartItem);

module.exports = router;
