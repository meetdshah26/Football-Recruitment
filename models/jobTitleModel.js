const mongoose = require('mongoose');

const jobTitleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Title Name is required.'],
    trim: true,
  },
  isDeleted: { type: Boolean, default: false, select: false },
});

module.exports = mongoose.model('Job Title', jobTitleSchema);
