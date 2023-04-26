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
      res.render("signup", { message: "Password has to be minimum 8 characters" })
      return
    }

    User.findOne({ username })
    .then(userFromDB => {
      console.log(userFromDB)

      if (userFromDB !== null) {
        res.render("signup", { message: "Username is already taken" })
      } else {
        // Username is available
        // Hash password
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        console.log(hash)

    User.create({ username: username, password: hash })
          .then(createdUser => {
            console.log(createdUser)
            res.redirect("/auth/login")
          })
          .catch(err => {
            next(err)
          })
        }
      })
    })

router.get("/auth/login", (req, res, next) => {
      res.render("login")
})  

router.post("/auth/login", (req, res, next) => {
  const { username, password } = req.body

  // Find user in database by username
  User.findOne({ username })
    .then(userFromDB => {
      if (userFromDB === null) {
        // User not found in database => Show login form
        res.render("login", { message: "Wrong credentials" })
        return
      }
      // Check if password from input form matches hashed password from database
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // Password is correct => Login user
        req.session.user = userFromDB
        if (userFromDB.profileCreated === true){ 
          res.redirect("/main")
        } else { 
          res.redirect("/profile")
        }
        
      } else {
        res.render("login", { message: "Wrong credentials" })
        return
      }
})
    
router.get("/auth/logout", (req, res, next) => {
      // Logout user
      req.session.destroy()
      res.redirect("/")
    })
})

router.get("/main", isLoggedIn, (req, res, next) => {
  User.findOne({  _id: req.session.user._id  })
    .then(currentUser => {
      res.render("main", { currentUser })
    })
})


module.exports = router;
