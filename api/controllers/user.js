const mongoose = require("mongoose");
const  User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const UserController = {

user_signup: (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(422).json({
                message: "Mail exists already"
            })
        }
        else{
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                if (err) {
                    return res.status(500).json({
                        error:  err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password: hash  
                    })
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({  
                            message: 'User created successfully'
                    })
                })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
},

user_login: (req, res, next) => {
    console.log('JWT_KEY:', process.env.JWT_KEY)
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: "Authentication failed"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    if (err) {
        return res.status(401).json({
            message: "Authentication failed"
        })
    }
    if (result) {
        const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
        }, 
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }
        )
        return res.status(200).json({
            message: "Authentication succcessful",
            token: token
        })
    } else {
        return res.status(401).json({
            message: "Authentication failed"
        });
    }
    })
})
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
},

user_delete: (req, res, next) => {
    User.deleteOne({ _id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User deleted successfully"
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
}
};

module.exports = OrdersController;
