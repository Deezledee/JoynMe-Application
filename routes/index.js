const express = require('express')
const { isLoggedIn } = require('../middleware/route-guard')
const router = express.Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const { uploader, cloudinary } = require("../config/cloudinary.config")



router.get("/", (req, res, next) => {
  res.render("index")
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
  })

router.post("/main", isLoggedIn, uploader.single('file'), (req, res, next) => {

   const {  email, intrests, about, termsAccepted } = req.body
   const userId = req.session.user._id
   const imgPath = req.file.path

   User.findByIdAndUpdate(userId, {  email, intrests, about, termsAccepted, picture: imgPath, profileCreated: true }, { new: true })
   .then(currentUser => {
    res.redirect("main", { currentUser })
   })
})

router.get('/create-event', isLoggedIn, (req, res, next) => {
  User.findOne({  _id: req.session.user._id  })
    .then(currentUser => { 
  res.render('create-event', { currentUser })
}) })

router.post("/event-detail", (req, res, next) => {
  const organizer = req.session.user._id
  const { title, location, date, time, description, maxParticipants } = req.body

  Event.create({ organizer, title, location, date, time, description, maxParticipants })
    .then(newEvent => 
      User.findOne({  _id: req.session.user._id  })
      .then(currentUser => { 
        res.render("event-detail", { newEvent , currentUser })   
      })
    )
}) 

// render created and joined events
router.get('/my-events', isLoggedIn, (req, res, next) => {
  const userId = req.session.user._id
  Event.find({organizer: userId})
  .populate('participants')
  .then(eventsFromDB => {
    Event.find({participants: userId})
    .populate('organizer')
    .then(joinedEvents => {
     User.findOne({  _id: req.session.user._id  })
    .then(currentUser => { 
      res.render('my-events', {events: eventsFromDB, participation: joinedEvents, currentUser } ) } )
    }) 
  })
})


router.get('/edit-event/:id', (req, res, next) =>{
  Event.findById(req.params.id)
    .then(eventToEdit =>{
      User.findOne({  _id: req.session.user._id  })
       .then(currentUser => { 
        res.render("edit-event", {eventToEdit, currentUser}) 
      })
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
      res.render("event-detail", {newEvent})
      res.render("/my-events")
    })
    .catch(err => next(err))
})

// delete created event
router.get('/delete-event/:id', (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/my-events')
    })
    .catch(err => next(err))
})

//browse events
router.post('/upcoming-events', (req, res, next) => {
  const { location, date } = req.body
  Event.find({ location, date })
    .populate('organizer')
    .populate('participants')
    .then( foundEvents => {
      //filter out fully booked events
     const availableEvents = []
      foundEvents.forEach(event => {
        if(event.maxParticipants > event.participants.length) {
          availableEvents.push(event)
        }
      }) 
      User.findOne({  _id: req.session.user._id  })
      .then(currentUser => {      
      res.render('upcoming-events', { events: availableEvents, currentUser })
      })
    })
})

//user joins the event
router.get('/join-event/:id', (req, res, next) => {
  const eventId = req.params.id
  const userId = req.session.user._id

  Event.findByIdAndUpdate(eventId, { $push: { participants:  userId  } }, {new: true})
    .then(() => {
      res.redirect('/my-events')
    })
})

// user cancels participation in event they previously joined
router.get('/cancel/:id', (req, res, next) => {
  const userId = req.session.user._id
  const eventId = req.params.id

  Event.findByIdAndUpdate(eventId, { $pull: { participants:  userId  } }, {new: true})
  .then(() => {
    res.redirect('/my-events')
  })
})

//view profile details
router.get('/profile-details', (req, res, next) => {
  User.findOne({  _id: req.session.user._id  })
    .then(currentUser => {
      res.render('profile-details', { currentUser })
    })
})

//got to edit profile view
router.get('/edit-profile', (req, res, next) => {
  User.findOne({  _id: req.session.user._id  })
    .then(currentUser => {
      res.render('edit-profile', { currentUser })
    })
})

//update user profile
router.post('/edit-profile', uploader.single('profileImg'), (req, res, next) => {
console.log("FILE ", req.file)
const userId = req.session.user._id
let imgPath 

if (req.file && req.file.path) {
  imgPath = req.file.path
}

const { username, email, interests, about } = req.body

User.findByIdAndUpdate(userId, { profileCreated: true, username, email, interests, about, picture: imgPath }, {new: true})
  .then(() => {
    res.redirect('/profile-details')
  })
})

router.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy')
})

module.exports = router
