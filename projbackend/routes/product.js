const express = require("express");
const router = express.Router();

const { getProductById, createProduct, getProduct, getPhoto, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("../controllers/product")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getCategoryById } = require("../controllers/category")
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.param("productId", getProductById);

// all of actual routes

//create route
router.post("/product/create/:userId",isSignedIn, isAuthenticated, isAdmin, createProduct )
//read
router.get("/product/:productId", getProduct)
// get photo Middleware
router.get("/product/photo/:productId", getPhoto)

//delete route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// put route 
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// Listing route
router.get("/products", getAllProducts)
// list by category
router.get("/products/categories", getAllUniqueCategories)
module.exports = router;