const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilmSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  link: {
    type: String
  },
  pictures: {
    type: String
  },
  cinemas: {
    type: [String],
    default: []
  }
})
mongoose.model('films', FilmSchema)
