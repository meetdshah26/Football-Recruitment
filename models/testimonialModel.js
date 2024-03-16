const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Testimonial', testimonialSchema);
