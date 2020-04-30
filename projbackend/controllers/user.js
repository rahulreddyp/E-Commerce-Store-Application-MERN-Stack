const User = require("../models/user")
const Order = require("../models/order")
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: "No user found in DB"
            })
        }

        req.profile =user
        next();
    });
};
 
exports.getUser = (req, res, next) =>{
    // TODO: get back for password
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};

exports.updateUser  = (req, res, next) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: "You are not authorized to update this action"
                })
            }

            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user)
        }
    )
}

exports.getAllUsers = (req, res, next) =>{
    User.find().exec((err, users) =>{
        if(err || !users){
            return res.status(400).json({
                error: "No user found in DB"
            })
        }
        res.json(users)
    })
}

exports.userPurchaseList= (req, res) => {
    Order.find({user: req.profile._id})
    .populate("User","_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error: " No Orders in this account"
            })

        }
    })
}

exports.pushOrderInPurchaseList = (req, res, next) => {
   let purchases = []
   req.body.order.products.forEach(item => {
       purchases.push({
           _id: item._id,
           name: item.name,
           description: item.description,
           category: product.category,
           quantity: product.quantity,
           amount: req.body.order.amount,
           transaction_id: req.body.order.transaction_id    
       })
   })

   // store in DB
   User.findOneAndUpdate(
       {_id: req.profile._id},
       {$push: {purchases: purchases}},
       {new: true},
       (err, purchase) => {
           if(err){
               return res.status(400).json({
                   error: "Unable to save purchase list"
               })
           }

       }
   )
    next()
}

