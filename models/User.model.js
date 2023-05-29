const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  interests: [String],
  about: String,
  termsAccepted: {
    type: Boolean,
    default: false
  },
  picture: {
    type: String,
    default: "https://cvhrma.org/wp-content/uploads/2015/07/default-profile-photo.jpg"
  },
  profileCreated: {
    type: Boolean,
    default: false
  }
});


const User = model("User", userSchema);
module.exports = User;
