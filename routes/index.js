const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const User = require("../models/User.model")
const Event = require("../models/Event.model")



router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
   })

router.post("/main", isLoggedIn, (req, res, next) => {
   const {  email, intrests, about, termsAccepted } = req.body
   const userId = req.session.user._id

   User.findByIdAndUpdate(userId, {  email, intrests, about, termsAccepted, profileCreated: true }, { new: true })
   .then(currUser => {
    res.redirect("main")
   })
  
})

router.get('/create-event', isLoggedIn, (reg, res, next) => {
  res.render('create-event')
})

router.post("/event-detail", (req, res, next) => {
  const organizer = req.session.user._id
  const { title, location, date, time, description, maxParticipants } = req.body

  Event.create({ organizer, title, location, date, time, description, maxParticipants })
    .then(newEvent => 
      res.render("event-detail", {newEvent})
    )
})



router.get('/my-events', isLoggedIn, (req, res, next) => {
  const organizer = req.session.user._id
  Event.find({organizer})
  .then(eventsFromDB => {
  res.render('my-events', {events: eventsFromDB} ) } )
})


router.get('/edit-event/:id', (req, res, next) =>{
  Event.findById(req.params.id)
    .then(eventToEdit =>{
      res.render("edit-event", {eventToEdit})
      })
})

router.post('/edit-event/:id', (req, res, next) => {
  const { title, location, date, time, description, maxParticipants } = req.body
  Event.findByIdAndUpdate(req.params.id, { 
    title, 
    location, 
    date, 
    time, 
    description, 
    maxParticipants }, {new: true})
    .then((newEvent) => {
      res.render(`event-detail`, {newEvent})
    })
    .catch(err => next(err))
})

router.get('/delete-event/:id', (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/my-events')
    })
    .catch(err => next(err))
})

router.post('/upcoming-events', (req, res, next) => {
  const { location, date } = req.body
  Event.find({ location, date })
    .then( events => {
      res.render('upcoming-events', { events })
    })
})

router.get('/join-event/:id', (req, res, next) => {
  const eventId = req.params.id
  const userId = req.session.user._id

  Event.findByIdAndUpdate(eventId, { $push: { participants:  userId  } }, {new: true})
    .then(event => {
      console.log(event)
    })

})


module.exports = router;
