const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const eventSchema = new Schema({
  organizer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
  title: String,
  location: String,
  date: Date,
  time: String,
  description: String,
  pastEvent: {
    type: Boolean,
    default: false
  },
  maxParticipants: Number,
  participants: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],

});

const Event = model("Event", eventSchema);

module.exports = Event;
