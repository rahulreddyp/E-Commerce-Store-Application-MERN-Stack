// import {Router} from "express"; 
const { check, validationResult } = require('express-validator');

var express = require('express')
var router = express.Router()
const {signout, signup, signin, isSignedIn, isAuthenticated} = require("../controllers/auth")

// Practice
// router.use(function (req, res, next) {
//     console.log('%s %s %s', req.method, req.url, req.path)
//     next()
//   })

router.post("/signup",[
    check("name", "Name must be atleast 3 characters").isLength({ min: 3}),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atleast 3 char").isLength({min : 3})
    .matches(/\d/).withMessage('must contain a number')
], signup)


router.post("/signin",[
    check("email", "Email is mandatory").isEmail(),
    check("password", "Password field is required").isLength({min : 3})
    .matches(/\d/).withMessage('must contain a number')
], signin)

router.get("/signout", signout) 

router.get("/test", isSignedIn, (req, res) => {
    res.json(req.auth)

})

router.get("/testAuthenticate", isAuthenticated, (req, res) =>{
    res.send("AUTHORISED")
})

module.exports = router;