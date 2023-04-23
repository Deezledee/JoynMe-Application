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
  termsAccepted: Boolean,
  picture: String,
});


const User = model("User", userSchema);
module.exports = User;
