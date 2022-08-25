const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add the post title!'],
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: [true, 'Please add the post content!'],
    },
    image: {
      type: String,
      required: false,
    },
    airBnBPrice: {
      type: Number,
      required: false,
    },
    hotelPrice: {
      type: Number,
      required: false
    },
    couplePrice: {
      type: Number,
      required: false
    },
    familyPrice: {
      type: Number,
      required: false
    }
    // images: {
    //   type: [Object],
    //   required: false,
    // }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema)