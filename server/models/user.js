const mongoose = require("mongoose")

const User = mongoose.model("User", {
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  }
})

module.exports = { User }