const { Schema, model } = require("mongoose");

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
