const mongoose = require('mongoose');
const validator = require('validator');

const MessageSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required.'],
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value, 'any', { strictMode: true }))
        throw new Error('Phone is invalid');
    },
  },
  message: {
    type: String,
    required: [true, 'Message is required.'],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
