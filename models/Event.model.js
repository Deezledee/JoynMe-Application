const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const eventSchema = new Schema({
  title: String,
  location: String,
  organizer: String,
});

const Event = model("Event", eventSchema);

module.exports = Event;
