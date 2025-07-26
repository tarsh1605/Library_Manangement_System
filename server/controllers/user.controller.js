const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password,role } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400).json({
      message:"Username already exits"
    });
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    role
  });
  console.log(user);
  res.status(201).json({
    _id: user._id,
    username: user.username,
    role: user.role,
    token: generateToken(user._id)
  });
});


const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if(!user){
    res.status(400).json({
      message:"Username not found"
    });
    throw new Error('Username not found');
  }
  if(await bcrypt.compare(password,user.password)){
      res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id)
  });
}
else{
res.status(400).json({
      message:"Wrong password"
    });
  throw new Error('Wrong password');
}
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getProfile
};