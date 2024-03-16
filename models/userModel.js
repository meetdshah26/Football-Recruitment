const mongoose = require('mongoose');
const validator = require('validator');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validate = require('../utils/validation.json');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, validate.name], trim: true },
  email: {
    type: String,
    required: [true, validate.email],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, validate.emailInvalid],
  },
  phone: {
    type: String,
    // required: [true, validate.phone],
  },
  password: {
    type: String,
    required: [true, validate.password],
    minlength: [6, 'Password should be atleast 6 characters long.'],
    trim: true,
    select: false,
  },
  resumes: [
    {
      resumeTitle: { type: String },
      resumePdf: { type: String },
      selected: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
  jobTitle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job Title',
    },
  ],
  jobSkill: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job Skill',
    },
  ],
  experience: { type: String },
  city: { type: String, trim: true, required: [true, validate.city] },
  state: { type: String, trim: true, required: [true, validate.state] },
  country: {
    type: String,
    trim: true,
  },
  date: { type: Date, default: Date.now },
});

// Generating tokens
userSchema.methods.generateAuthToken = function () {
  try {
    return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '90d',
    });
  } catch (error) {
    throw createError.BadRequest(error);
  }
};

// Converting password into hash
userSchema.post('validate', async function (doc) {
  if (doc.isModified('password')) {
    if (doc.password) doc.password = await bcrypt.hash(doc.password, 10);
  }
});

// check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = new mongoose.model('User', userSchema);
