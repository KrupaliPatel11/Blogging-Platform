const Admin = require('../models/admin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findOneAndUpdate } = require('../models/admin');

exports.admin_signup = (req, res, next) => {
    Admin.find({ email: req.body.email })
        .exec()
        .then(admin => {
            if (admin.length >= 1) {
                return res.status(200).json({
                    message: 'Mail Exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const admin = new Admin({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            token: toke
                        })
                        admin
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json({
                                    message: 'Admin Created'
                                });
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
}

exports.admin_login = (req, res, next) => {
    Admin.find({ email: req.body.email })
        .exec()
        .then(admin => {
            if (admin.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: admin[0].email,
                        adminId: admin[0]._id,
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: "4h"
                        });

                    Admin.findOneAndUpdate({ email: req.body.email }, { $set: { token: token } }).exec()

                    return res.status(200).json({
                        _id: new mongoose.Types.ObjectId(),
                        id: req.body.adminId,
                        message: 'Auth Successful',
                        token: token
                    })
                }
            })
        })
}

exports.admin_delete = (req, res, next) => {
    Admin.findByIdAndDelete({ _id: req.params.adminId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Admin Deleted',
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.admin_logout = (req, res, next) => {
    let admin = req.userData.adminId;
    Admin.findByIdAndUpdate(admin, { $set: { token: null } }).exec()
    console.log(admin);
    res.status(200).json({
        message: 'Admin Logout',
    })
}