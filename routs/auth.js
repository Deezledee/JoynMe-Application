const router = require("express").Router()
const { isLoggedIn } = require('../middleware/route-guard');
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
  })
  
  router.post("/auth/signup", (req, res, next) => {
    const { username, password } = req.body
  
   
    if (username === "") {
      res.render("signup", { message: "Username cannot be empty" })
      return
    }
  
    if (password.length < 8) {
      res.render("signup", { message: "Password has to be minimum 4 characters" })
      return
    }
})