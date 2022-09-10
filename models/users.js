const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  coverPhoto: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  subscribers: {
    type: Number,
    required: true
  },
  subscriptions: [],
  playlists: [],
  audios: []
});

module.exports = mongoose.model("User", UserSchema, 'users');
