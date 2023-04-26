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
    default: "https://www.vecteezy.com/vector-art/2534006-social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background"
  },
  profileCreated: {
    type: Boolean,
    default: false
  }
});


const User = model("User", userSchema);
module.exports = User;
