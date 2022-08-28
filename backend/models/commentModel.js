const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('Comment', commentSchema)