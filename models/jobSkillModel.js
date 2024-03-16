const mongoose = require('mongoose');

const jobSkillSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill Name is required.'],
    trim: true,
  },
  isDeleted: { type: Boolean, default: false, select: false },
});

module.exports = new mongoose.model('Job Skill', jobSkillSchema);
