const mongoose = require('mongoose');

const pageSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
    },
    title: { type: String, required: [true, 'Title is required'] },
    content: String,
    url: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model('Page', pageSchema);
