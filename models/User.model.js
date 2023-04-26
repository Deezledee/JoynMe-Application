const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
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
