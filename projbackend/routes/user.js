const express = require("express")
const router = express.Router()

const {getUserById, getUser, getAllUsers, updateUser, userPurchaseList} = require("../controllers/user")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")

router.param("userId", getUserById)

// Get Single User
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
// Update User 
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
router.put("/user/orders/:userId", isSignedIn, isAuthenticated, userPurchaseList)

//Get all Users
router.get("/users", getAllUsers)

module.exports = router;