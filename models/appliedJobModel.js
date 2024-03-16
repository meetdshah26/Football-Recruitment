const mongoose = require('mongoose');

const appliedJobSchema = mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resumePdf: {
      type: String,
      required: [true, 'Resume is required.'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Applied job', appliedJobSchema);
