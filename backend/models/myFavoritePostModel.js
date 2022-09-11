const mongoose = require('mongoose');

const myFavoritePostSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);
myFavoritePostSchema.index({ user: 1, post: 1 }, {unique: true});

module.exports = mongoose.model('MyFavoritePost', myFavoritePostSchema)