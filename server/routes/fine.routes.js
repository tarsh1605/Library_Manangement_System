const express = require('express');
const router = express.Router();

const { getMyFines, getAllFines, payFine } = require('../controllers/fine.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const {adminOnly}=require('../middleware/role.middleware.js')

router.get('/my', protect, getMyFines);


router.get('/', protect, adminOnly,getAllFines);

router.patch('/pay/:id', protect, payFine);

module.exports = router;
