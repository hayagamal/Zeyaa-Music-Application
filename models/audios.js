const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AudioSchema = new Schema({
  user: {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    subscribers: {
      type: String,
      required: false
    },
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  minutes: {
    type: Number,
    required: true
  },
  seconds: {
    type: Number,
    required: true
  },
  watch: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    required: true
  },
  playlist: {
    type: String,
    required: false
  },
  likers: [],
  dislikers: [],
  comments: []
});

module.exports = mongoose.model("Audio", AudioSchema, 'audios');
