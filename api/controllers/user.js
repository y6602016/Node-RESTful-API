const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.userSignup = (req, res, next)=> {
    User.find({email:req.body.email})
    // find user with specific email, and we'll receive an array
    // we still get an array even find no user, which is an empty array
    // so we need to check the size of the array
        .then(user=> {
            // user.length == 1 means find 1 existing email
            if (user.length === 1) {
                return res.status(409).json({
                    message: 'Existing mail'
                });
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash)=> {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                            });
                        user.save()
                            .then(result=> {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err=> {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
            }
            )
            }
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            })
        })   
}

exports.userLogin = (req, res, next)=> {
    User.find({email: req.body.email})
        .then(result=> {
            if (result.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, result[0].password, (err, auth)=> {
                if (err) {
                    
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (auth) {
                    const token = jwt.sign(
                        {
                        email: result[0].email,
                        userId: result[0]._id,
                        },
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "1h"
                        }
                        );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            })
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteUser = (req, res, next)=> {
    User.remove({_id: req.params.userId})
        .then(result=> {
            res.status(200).json({
                message: 'user deleted'
            });
        })
        .catch(err=> {
            res.status(500).json({
                error: err
            })
        })
}