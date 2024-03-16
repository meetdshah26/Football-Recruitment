const mongoose = require('mongoose');
const validator = require('validator');
const validate = require("../utils/validation.json")

const recruiterSchema = mongoose.Schema(
  {
    image: {
      type: String,
      default: '/uploads/default_user.jpg',
    },
    recruiterName: {
      type: String,
      required: [true, 'Recruiter name is required.'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, validate.email],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, validate.emailInvalid],
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true,
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recruiter', recruiterSchema);
