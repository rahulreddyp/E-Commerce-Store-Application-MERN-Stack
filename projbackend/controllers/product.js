const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, item) => {
        if(err){
            return res.status(400).json({
                error: "No Product found with that Id"
            })
        }
        req.product = item
        next()
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with Image"
            })
        }

        // destructure the fields - validations
        const { name, description, price, category, stock } = fields;

        if(
            !name ||
            !description || 
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: " All the fields are mandatory!"
            })
        }


        // restrictions on field
        let product = new Product(fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType =file.photo.type
        }

        // save to DB
        product.save((err, item) => {
            if(err){
                res.status(400).json({
                    error: "Saving product to DB Failed!"
                })
            }
            res.json(item)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

// Middleware
exports.getPhoto = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//delete controllers
exports.deleteProduct = (req, res) =>{
    let product = req.product
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: `Failed to delete ${product}`
            })
        }
        res.json({
            message: "Deletion was successfull",
            deletedProduct

        })
    })
}

//Update controllers
exports.updateProduct = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with Image"
            })
        }

        // updation code
        let product = req.product;
        product = _.extend(product, fields)

        // handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType =file.photo.type
        }

        // save to DB
        product.save((err, item) => {
            if(err){
                res.status(400).json({
                    error: "updation of product Failed!"
                })
            }
            res.writeHead(200, {'content-type' : 'application/json'})
            // res.json(item)
            res.end(item, null, 2);
        } )
    })
}

// product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "No product found"
            })
        }
        res.json(products)
    })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error: "No category Found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations  = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    }) 

    Product.bulkWrite(myOperations, {}, (err, result) =>{
        if(err){
            return res.status(400).json({
                error: "bbulk ops failed!"
            })
        }
    })


    next()
}
