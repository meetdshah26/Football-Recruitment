const mongoose = require('mongoose');
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'validation.email'],
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('validation.emailInvalid');
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model('Newsletter', newsletterSchema);
