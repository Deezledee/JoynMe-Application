const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const User = require("../models/User.model")


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("profile", { user: user })
   })

   router.post("/profile", isLoggedIn, (req, res, next) => {
   const user = req.session.user
   console.log(req.body)
   

   User.findOneById("user._id")
   .then(userFromDB => {
    console.log(userFromDB)
   })
    })
    


module.exports = router;
