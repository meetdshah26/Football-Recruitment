const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: [true, 'Image is required.'] },
  imageAlt: { type: String, required: true },
});

module.exports = new mongoose.model('Banner', bannerSchema);
